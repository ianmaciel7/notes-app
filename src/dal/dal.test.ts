import { describe, expect, it } from "vitest";
import { createSpaceAction } from "@/actions/space-actions";
import { assertSpaceAccess, DEV_DEFAULT_USER } from "./auth";
import { toEntityDTO, toSpaceDTO } from "./dtos";
import { ForbiddenError, NotFoundError } from "./errors";
import { createSpace, getSpaceDTO, getSpacesDTO } from "./spaces";

describe("DAL: DTO Sanitization & Auth", () => {
  describe("DTO Sanitization & Minimization", () => {
    it("converts SpaceRecord to SpaceDTO correctly", () => {
      const record = {
        id: "space-1",
        name: "Test Space",
        description: "Test Description",
        icon: "folder" as const,
        color: "blue" as const,
        accountId: "acc-1",
        sortOrder: 0,
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
      };

      const dto = toSpaceDTO(record, "acc-1");
      expect(dto.id).toBe("space-1");
      expect(dto.name).toBe("Test Space");
      expect(dto.isOwner).toBe(true);

      const notOwnerDto = toSpaceDTO(record, "acc-2");
      expect(notOwnerDto.isOwner).toBe(false);
    });

    it("converts SpaceEntityRecord to EntityDTO correctly", () => {
      const record = {
        spaceId: "space-1",
        id: "ent-1",
        objectTypeId: "page",
        type: "page",
        title: "Test Page",
        tags: ["design", "arch"],
        relations: [],
        properties: { status: "draft", secretInternalKey: "do-not-leak" },
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
      };

      const dto = toEntityDTO(record);
      expect(dto.id).toBe("ent-1");
      expect(dto.spaceId).toBe("space-1");
      expect(dto.title).toBe("Test Page");
      expect(dto.tags).toEqual(["design", "arch"]);
      expect(dto.properties).toEqual({ status: "draft", secretInternalKey: "do-not-leak" });
    });
  });

  describe("Authorization & IDOR Prevention", () => {
    it("allows access when viewer owns the space", () => {
      const viewer = { ...DEV_DEFAULT_USER, role: "user" as const, accountId: "acc-user" };
      expect(() => assertSpaceAccess(viewer, "acc-user")).not.toThrow();
    });

    it("allows access when viewer is an admin", () => {
      const viewer = { ...DEV_DEFAULT_USER, role: "admin" as const, accountId: "acc-admin" };
      expect(() => assertSpaceAccess(viewer, "different-acc")).not.toThrow();
    });

    it("throws ForbiddenError when non-admin viewer tries to access another account's space", () => {
      const viewer = { ...DEV_DEFAULT_USER, role: "user" as const, accountId: "acc-user" };
      expect(() => assertSpaceAccess(viewer, "different-acc")).toThrow(ForbiddenError);
    });
  });
});

describe("DAL: Spaces & Actions", () => {
  describe("Server-Only DAL Spaces Functions", () => {
    it("retrieves spaces list via getSpacesDTO", async () => {
      const spaces = await getSpacesDTO();
      expect(spaces.length).toBeGreaterThanOrEqual(2);
      expect(spaces.some((s) => s.id === "personal-space")).toBe(true);
    });

    it("retrieves a single space by ID", async () => {
      const space = await getSpaceDTO("personal-space");
      expect(space.id).toBe("personal-space");
      expect(space.name).toBe("Personal Space");
    });

    it("throws NotFoundError when space does not exist", async () => {
      await expect(getSpaceDTO("non-existent-space")).rejects.toThrow(NotFoundError);
    });

    it("creates a new space and returns sanitized DTO", async () => {
      const newSpace = await createSpace({
        name: "New Architecture Space",
        description: "Testing DAL creation",
        icon: "code",
        color: "emerald",
      });

      expect(newSpace.name).toBe("New Architecture Space");
      expect(newSpace.color).toBe("emerald");
      expect(newSpace.isOwner).toBe(true);
    });

    it("validates space name when creating", async () => {
      await expect(createSpace({ name: "   " })).rejects.toThrow();
    });
  });

  describe("Server Actions Integration", () => {
    it("executes createSpaceAction successfully", async () => {
      const result = await createSpaceAction({
        name: "Action Created Space",
        description: "Created via Server Action",
        icon: "zap",
        color: "purple",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("Action Created Space");
        expect(result.data.icon).toBe("zap");
      }
    });

    it("returns validation error for invalid action input", async () => {
      const result = await createSpaceAction({
        name: "",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.code).toBe("VALIDATION_ERROR");
      }
    });
  });
});

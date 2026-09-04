import type { KnowledgeDatabase } from "@/lib/db";
import { createPersonalSpaceSeed } from "@/lib/spaces/personal-space-seed";
import { ACTIVE_SPACE_SETTING_ID, PERSONAL_SPACE_ID } from "@/lib/spaces/space-types";

export async function bootstrapSpace(
  database: KnowledgeDatabase,
  now: () => Date = () => new Date(),
) {
  const seed = createPersonalSpaceSeed(now);

  await database.transaction(
    "rw",
    database.spaces,
    database.appSettings,
    database.objectTypes,
    async () => {
      const personal = await database.spaces.get(PERSONAL_SPACE_ID);
      if (!personal) {
        await database.spaces.add(seed.space);
        await database.objectTypes.bulkAdd(seed.objectTypes);
      }

      const active = await database.appSettings.get(ACTIVE_SPACE_SETTING_ID);
      const activeExists = active ? Boolean(await database.spaces.get(active.value)) : false;
      if (!activeExists) {
        await database.appSettings.put({
          id: ACTIVE_SPACE_SETTING_ID,
          value: PERSONAL_SPACE_ID,
        });
      }
    },
  );
}

export const bootstrapWorkspace = bootstrapSpace;

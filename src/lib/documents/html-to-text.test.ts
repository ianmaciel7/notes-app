import { describe, expect, it } from "vitest";
import { decodeBasicHtmlEntities, stripHtmlMarkup } from "@/lib/documents/html-to-text";

describe("HTML text extraction primitives", () => {
  it("removes script and style content and preserves block boundaries", () => {
    const html = "<style>p{color:red}</style><p>Alpha<br>Beta</p><script>ignore()</script>";
    expect(stripHtmlMarkup(html)).toBe("  Alpha\nBeta\n ");
  });

  it("decodes only the existing basic entity set without reinterpreting markup", () => {
    expect(decodeBasicHtmlEntities("&nbsp;&amp;&lt;&gt;&quot;&#39;&#x41;")).toBe(" &<>\"'&#x41;");
    expect(decodeBasicHtmlEntities(stripHtmlMarkup("<p>&lt;b&gt;Literal&lt;/b&gt;</p>"))).toBe(
      " <b>Literal</b>\n",
    );
  });

  it("leaves whitespace normalization to the caller", () => {
    expect(stripHtmlMarkup("<p>A  \tB&nbsp; C</p>")).toBe(" A  \tB&nbsp; C\n");
  });
});

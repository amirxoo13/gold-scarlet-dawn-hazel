import { createFileRoute } from "@tanstack/react-router";
import { generateCharacter, PipelineError } from "@/lib/cta5/run-pipeline.server";

export const Route = createFileRoute("/api/generate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let form: FormData;
        try {
          form = await request.formData();
        } catch {
          return Response.json(
            { error: "بدنهٔ درخواست باید multipart/form-data باشد." },
            { status: 400 },
          );
        }

        const front = form.get("front");
        const back = form.get("back");
        const name = form.get("name");

        if (!(front instanceof File)) {
          return Response.json({ error: "عکس جلو (front) الزامی است." }, { status: 400 });
        }

        try {
          const result = await generateCharacter(
            {
              front,
              back: back instanceof File ? back : null,
              name: typeof name === "string" && name.trim() ? name.trim() : "Character",
            },
            request.signal,
          );
          const gatesHeader = encodeURIComponent(JSON.stringify(result.gates));
          return new Response(new Uint8Array(result.zip), {
            status: 200,
            headers: {
              "Content-Type": "application/zip",
              "Content-Disposition": `attachment; filename="${result.fileName}"`,
              "X-CTA5-Gates-Passed": String(result.gatesPassed),
              "X-CTA5-Gates-Total": String(result.gatesTotal),
              "X-CTA5-Has-Back": String(result.hasBack),
              "X-CTA5-Gates": gatesHeader,
            },
          });
        } catch (err) {
          if (err instanceof PipelineError) {
            return Response.json({ error: err.message }, { status: err.status });
          }
          console.error("generate pipeline failed", err);
          return Response.json({ error: "خطای غیرمنتظره در تولید کاراکتر." }, { status: 500 });
        }
      },
    },
  },
});

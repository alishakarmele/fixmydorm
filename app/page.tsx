import { APP_NAME, APP_DESCRIPTION, APP_VERSION } from "@/lib/constants";

/**
 * FixMyDorm – Landing Page (Phase 0)
 *
 * A minimal placeholder page confirming the project scaffolding is complete.
 * Will be replaced with the full landing page + auth flow in Phase 1.
 */
export default function Home() {
  return (
    <main className="flex-1 flex items-center justify-center">
      <div className="text-center space-y-6 px-6">
        {/* Logo / Title */}
        <div className="space-y-2">
          <h1 className="text-5xl font-bold tracking-tight">
            🏠 {APP_NAME}
          </h1>
          <p className="text-lg text-foreground/60 max-w-md mx-auto">
            {APP_DESCRIPTION}
          </p>
        </div>

        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/5 px-4 py-2 text-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          Phase 0 Complete — Project Scaffolding Ready
        </div>

        {/* Tech Stack Tags */}
        <div className="flex flex-wrap justify-center gap-2 text-xs font-mono">
          {[
            "Next.js",
            "TypeScript",
            "Tailwind CSS",
            "AWS Cognito",
            "DynamoDB",
            "Lambda",
            "S3",
            "Bedrock AI",
          ].map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-foreground/10 bg-foreground/5 px-2.5 py-1"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Version */}
        <p className="text-xs text-foreground/40 font-mono">v{APP_VERSION}</p>
      </div>
    </main>
  );
}

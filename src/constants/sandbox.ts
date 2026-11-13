export const SANDBOX_TIMEOUT = 60_000 * 10 * 3; // 30 minutes

// Sandbox template: the local Docker image tag (scripts/sandbox/build-image.sh).
export const SANDBOX_TEMPLATE = "molten-nextjs-template";

// The same template on E2B (template_id in sandbox/nextjs/e2b.toml). The id
// stays the same when the template is renamed, so builds keep working until
// it's republished. Override with E2B_TEMPLATE to use another template.
export const E2B_TEMPLATE_ID = "kqnfcqg68j8appy0tsv8";

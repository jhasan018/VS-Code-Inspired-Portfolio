ALTER TABLE projects
ADD COLUMN IF NOT EXISTS project_type TEXT NOT NULL DEFAULT 'company'
CHECK (project_type IN ('company', 'personal'));

UPDATE projects
SET project_type = 'company'
WHERE project_type IS NULL;

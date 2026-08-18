ALTER TABLE projects
DROP CONSTRAINT IF EXISTS projects_project_type_check;

ALTER TABLE projects
ADD CONSTRAINT projects_project_type_check
CHECK (project_type IN ('company', 'client', 'personal'));

COMMENT ON COLUMN projects.project_type IS
'Project ownership type: company, client/freelance, or personal.';

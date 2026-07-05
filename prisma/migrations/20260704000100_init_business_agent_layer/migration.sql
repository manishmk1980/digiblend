CREATE TABLE IF NOT EXISTS audits (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  company_name VARCHAR(255) NOT NULL,
  company_url VARCHAR(2048) NOT NULL,
  operational_focus VARCHAR(120) NOT NULL,
  status ENUM('Processing', 'Waiting For Approval', 'Approved', 'Published', 'Failed') NOT NULL DEFAULT 'Processing',
  readiness_score TINYINT UNSIGNED NULL,
  snapshot_payload JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_audits_status_created_at (status, created_at),
  INDEX idx_audits_company_url (company_url(191))
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  audit_id BIGINT UNSIGNED NOT NULL,
  action_performed VARCHAR(120) NOT NULL,
  raw_input_payload JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_audit_logs_audit_id_created_at (audit_id, created_at),
  CONSTRAINT fk_audit_logs_audit_id
    FOREIGN KEY (audit_id)
    REFERENCES audits(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS audit_onboarding (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  audit_id BIGINT UNSIGNED NOT NULL,
  contact_email VARCHAR(255) NULL,
  operational_notes TEXT NULL,
  sample_file_name VARCHAR(255) NULL,
  status ENUM('Draft', 'Submitted', 'Locked') NOT NULL DEFAULT 'Draft',
  submitted_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY audit_onboarding_audit_id_key (audit_id),
  CONSTRAINT fk_audit_onboarding_audit_id
    FOREIGN KEY (audit_id)
    REFERENCES audits(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS agent_runs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  audit_id BIGINT UNSIGNED NULL,
  user_email VARCHAR(255) NULL,
  tool_slug VARCHAR(120) NOT NULL,
  workflow_type ENUM('AuditSnapshot', 'DeepAudit', 'CopyGeneration', 'SupportChat', 'ImplementationPlan') NOT NULL,
  status ENUM('Queued', 'Running', 'ReviewRequired', 'Completed', 'Failed') NOT NULL DEFAULT 'Queued',
  user_goal TEXT NOT NULL,
  state_payload JSON NULL,
  final_response JSON NULL,
  review_score TINYINT UNSIGNED NULL,
  error_message TEXT NULL,
  started_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_agent_runs_audit_id_created_at (audit_id, created_at),
  INDEX idx_agent_runs_workflow_status_created (workflow_type, status, created_at),
  CONSTRAINT fk_agent_runs_audit_id
    FOREIGN KEY (audit_id)
    REFERENCES audits(id)
    ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS agent_messages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  run_id BIGINT UNSIGNED NOT NULL,
  agent_name ENUM('Orchestrator', 'Planner', 'Researcher', 'Writer', 'Reviewer', 'Support', 'Admin') NOT NULL,
  role ENUM('system', 'user', 'assistant', 'tool') NOT NULL,
  content LONGTEXT NOT NULL,
  metadata JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_agent_messages_run_id_created_at (run_id, created_at),
  CONSTRAINT fk_agent_messages_run_id
    FOREIGN KEY (run_id)
    REFERENCES agent_runs(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS agent_memory (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  scope VARCHAR(120) NOT NULL,
  scope_key VARCHAR(255) NOT NULL,
  `key` VARCHAR(255) NOT NULL,
  value JSON NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_agent_memory_scope_key (scope, scope_key, `key`)
);

CREATE TABLE IF NOT EXISTS implementation_sync_requests (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  audit_id BIGINT UNSIGNED NOT NULL,
  contact_email VARCHAR(255) NULL,
  requested_scope TEXT NULL,
  status ENUM('Requested', 'Scheduled', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Requested',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_implementation_sync_status_created (status, created_at),
  CONSTRAINT fk_implementation_sync_audit_id
    FOREIGN KEY (audit_id)
    REFERENCES audits(id)
    ON DELETE CASCADE
);

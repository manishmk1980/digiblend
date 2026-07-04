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

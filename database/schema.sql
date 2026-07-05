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

CREATE TABLE IF NOT EXISTS tenants (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  primary_domain VARCHAR(255) NULL,
  status ENUM('Active', 'Suspended', 'Cancelled') NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_tenants_status_created_at (status, created_at)
);

CREATE TABLE IF NOT EXISTS customer_users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  tenant_id BIGINT UNSIGNED NOT NULL,
  email VARCHAR(255) NOT NULL,
  role ENUM('Customer', 'TenantAdmin') NOT NULL DEFAULT 'Customer',
  referred_by VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_active TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY customer_users_email_key (email),
  INDEX idx_customer_users_tenant_last_active (tenant_id, last_active),
  CONSTRAINT fk_customer_users_tenant_id
    FOREIGN KEY (tenant_id)
    REFERENCES tenants(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS customer_subscriptions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  tenant_id BIGINT UNSIGNED NOT NULL,
  plan ENUM('Free', 'Pro', 'Enterprise') NOT NULL DEFAULT 'Free',
  status ENUM('Active', 'Cancelled', 'Expired', 'PastDue') NOT NULL DEFAULT 'Active',
  payment_provider VARCHAR(80) NULL,
  provider_ref VARCHAR(160) NULL,
  amount_cents INT UNSIGNED NULL,
  currency VARCHAR(12) NOT NULL DEFAULT 'INR',
  started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_customer_subscriptions_tenant_status (tenant_id, status, created_at),
  CONSTRAINT fk_customer_subscriptions_tenant_id
    FOREIGN KEY (tenant_id)
    REFERENCES tenants(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS usage_events (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  tenant_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NULL,
  tool_slug VARCHAR(120) NOT NULL,
  tool_name VARCHAR(255) NULL,
  status ENUM('Success', 'Failed') NOT NULL DEFAULT 'Success',
  metadata JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_usage_events_tenant_created_at (tenant_id, created_at),
  INDEX idx_usage_events_tool_created_at (tool_slug, created_at),
  CONSTRAINT fk_usage_events_tenant_id
    FOREIGN KEY (tenant_id)
    REFERENCES tenants(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_usage_events_user_id
    FOREIGN KEY (user_id)
    REFERENCES customer_users(id)
    ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS admin_actions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  tenant_id BIGINT UNSIGNED NULL,
  target_user_id BIGINT UNSIGNED NULL,
  admin_email VARCHAR(255) NOT NULL,
  target_email VARCHAR(255) NULL,
  action VARCHAR(120) NOT NULL,
  notes TEXT NULL,
  metadata JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_admin_actions_admin_created_at (admin_email, created_at),
  INDEX idx_admin_actions_tenant_created_at (tenant_id, created_at),
  CONSTRAINT fk_admin_actions_tenant_id
    FOREIGN KEY (tenant_id)
    REFERENCES tenants(id)
    ON DELETE SET NULL,
  CONSTRAINT fk_admin_actions_target_user_id
    FOREIGN KEY (target_user_id)
    REFERENCES customer_users(id)
    ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS users (
  id INT NOT NULL AUTO_INCREMENT,
  clerk_user_id VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  role ENUM('CUSTOMER', 'ADMIN') NOT NULL DEFAULT 'CUSTOMER',
  plan ENUM('FREE', 'PRO') NOT NULL DEFAULT 'FREE',
  credit_balance INT NOT NULL DEFAULT 0,
  referral_code VARCHAR(64) NULL,
  referred_by VARCHAR(64) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY users_clerk_user_id_key (clerk_user_id),
  UNIQUE KEY users_referral_code_key (referral_code),
  INDEX idx_users_email (email),
  INDEX idx_users_plan_created_at (plan, created_at)
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  razorpay_sub_id VARCHAR(255) NULL,
  status ENUM('ACTIVE', 'CANCELLED', 'EXPIRED') NOT NULL DEFAULT 'ACTIVE',
  started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NULL,
  PRIMARY KEY (id),
  UNIQUE KEY subscriptions_razorpay_sub_id_key (razorpay_sub_id),
  INDEX idx_subscriptions_user_status (user_id, status),
  CONSTRAINT fk_subscriptions_user_id
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS usage_logs (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  tool_slug VARCHAR(120) NOT NULL,
  used_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_usage_logs_user_tool_used_at (user_id, tool_slug, used_at),
  CONSTRAINT fk_usage_logs_user_id
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS credit_packs (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  credits INT NOT NULL,
  price_inr INT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS credit_transactions (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  type ENUM('PURCHASE', 'SPEND', 'REFERRAL_BONUS', 'ADMIN_GRANT') NOT NULL,
  amount INT NOT NULL,
  tool_slug VARCHAR(120) NULL,
  razorpay_payment_id VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_credit_transactions_user_created_at (user_id, created_at),
  CONSTRAINT fk_credit_transactions_user_id
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS knowledge_documents (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  file_type VARCHAR(40) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_knowledge_documents_user_created_at (user_id, created_at),
  CONSTRAINT fk_knowledge_documents_user_id
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

ALTER TABLE admin_actions
  ADD COLUMN admin_id INT NULL,
  ADD COLUMN saas_target_user_id INT NULL,
  ADD INDEX idx_admin_actions_admin_id_created_at (admin_id, created_at),
  ADD INDEX idx_admin_actions_saas_target_created_at (saas_target_user_id, created_at),
  ADD CONSTRAINT fk_admin_actions_admin_id
    FOREIGN KEY (admin_id)
    REFERENCES users(id)
    ON DELETE SET NULL,
  ADD CONSTRAINT fk_admin_actions_saas_target_user_id
    FOREIGN KEY (saas_target_user_id)
    REFERENCES users(id)
    ON DELETE SET NULL;

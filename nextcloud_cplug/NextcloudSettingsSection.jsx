// ---------------------------------------------------------------------------
// Nextcloud Settings Section — file sync, WebDAV, calendar integration.
// ---------------------------------------------------------------------------

import React, { useState } from 'react';
import { useKernel } from '../../cms/kernel/providers.jsx';
import { Toggle, Field, Section, SettingsShell } from '../../cms/components/index.js';
import { Cloud, Link, FolderSync, Calendar } from 'lucide-react';

export function NextcloudSettingsSection() {
  const { getService } = useKernel();
  const storage = getService('storage');
  const saved = storage?.get('svc:nextcloud', {}) || {};

  const [enabled, setEnabled] = useState(saved.enabled ?? false);
  const [url, setUrl] = useState(saved.url || '');
  const [username, setUsername] = useState(saved.username || '');
  const [appPassword, setAppPassword] = useState(saved.appPassword || '');
  const [fileSync, setFileSync] = useState(saved.fileSync ?? true);
  const [calendarSync, setCalendarSync] = useState(saved.calendarSync ?? false);
  const [syncPath, setSyncPath] = useState(saved.syncPath || '/sovereign');
  const [done, setDone] = useState(false);

  function save() {
    storage?.set('svc:nextcloud', { enabled, url, username, appPassword, fileSync, calendarSync, syncPath });
    setDone(true);
    setTimeout(() => setDone(false), 2000);
  }

  return (
    <SettingsShell
      pluginId="nextcloud"
      serviceId="nextcloud"
      title="Nextcloud"
      icon={Cloud}
      iconColor="text-blue-400"
      badge={{ label: enabled ? 'Enabled' : 'Disabled', color: enabled ? 'emerald' : 'slate' }}
      onSave={save}
      saved={done}
      routingDefaults={{ defaultSubdomain: 'cloud', defaultPort: 80 }}
    >
      <div className="space-y-5">
        <Toggle label="Enable Nextcloud Integration" desc="Connect to a Nextcloud instance for file and calendar sync." value={enabled} onChange={setEnabled} card />

        {enabled && (
          <>
            <Section icon={Link} iconColor="text-blue-400" title="Connection">
              <div className="space-y-3">
                <Field label="Nextcloud URL" value={url} onChange={setUrl} placeholder="https://cloud.example.com" type="url" />
                <Field label="Username" value={username} onChange={setUsername} placeholder="admin" />
                <Field label="App Password" value={appPassword} onChange={setAppPassword} type="password" placeholder="••••••••" help="Generate an app password in Nextcloud → Security → App Passwords" />
              </div>
            </Section>

            <Section icon={FolderSync} iconColor="text-emerald-400" title="Sync Settings">
              <div className="space-y-3">
                <Toggle label="File Sync" desc="Sync files via WebDAV." value={fileSync} onChange={setFileSync} card />
                <Toggle label="Calendar Sync" desc="Sync calendars via CalDAV." value={calendarSync} onChange={setCalendarSync} card />
                <Field label="Sync Path" value={syncPath} onChange={setSyncPath} placeholder="/sovereign" help="Remote folder path for synced files" />
              </div>
            </Section>
          </>
        )}
      </div>
    </SettingsShell>
  );
}

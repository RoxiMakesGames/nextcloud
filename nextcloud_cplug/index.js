// ---------------------------------------------------------------------------
// Nextcloud Plugin — Self-hosted productivity suite integration.
// ---------------------------------------------------------------------------
import { definePlugin } from '../../cms/kernel/index.js';
import { Cloud } from 'lucide-react';
import NextcloudPage from './NextcloudPage.jsx';
import { NextcloudSettingsSection } from './NextcloudSettingsSection.jsx';

export default definePlugin({
  id: 'nextcloud_cplug',
  name: 'Nextcloud',
  type: 'service',
  required: false,
  defaultEnabled: true,
  version: '0.1.0',
  description: 'Nextcloud file storage, calendar, and collaboration integration.',
  icon: Cloud,
  category: 'Services',
  tags: ['service', 'storage', 'collaboration'],
  requires: ['user_cplug', 'auth_cplug'],

  routes: [
    { path: '/services/nextcloud', component: NextcloudPage, label: 'Nextcloud', permission: 'admin.config' },
  ],

  menuItems: [
    { id: 'nextcloud', to: '/services/nextcloud', icon: Cloud, label: 'Nextcloud', section: 'services', order: 30, permission: 'admin.config' },
  ],

  hooks: {
    hook_init({ registerService }) {
      registerService('nextcloud', {
        _baseUrl: '',
        configure(url) { this._baseUrl = url; },
        getStatus() { return { configured: !!this._baseUrl, url: this._baseUrl }; },
      });
    },

    hook_permission() {
      return [
        { id: 'nextcloud.admin',           label: 'Administer Nextcloud',          module: 'nextcloud' },
        { id: 'nextcloud.settings.view',   label: 'View Nextcloud settings',       module: 'nextcloud' },
        { id: 'nextcloud.settings.edit',   label: 'Edit Nextcloud settings',       module: 'nextcloud' },
        { id: 'nextcloud.sync',            label: 'Sync users to Nextcloud',       module: 'nextcloud' },
        { id: 'nextcloud.files.access',    label: 'Access Nextcloud files',        module: 'nextcloud' },
        { id: 'nextcloud.files.share',     label: 'Share Nextcloud files',         module: 'nextcloud' },
        { id: 'nextcloud.calendar.access', label: 'Access Nextcloud calendar',     module: 'nextcloud' },
        { id: 'nextcloud.apps.manage',     label: 'Manage Nextcloud apps',         module: 'nextcloud' },
      ];
    },

    hook_settings() {
      return {
        id: 'nextcloud',
        label: 'Nextcloud',
        icon: Cloud,
        weight: 62,
        category: 'Services',
        pluginId: 'nextcloud_cplug',
        component: NextcloudSettingsSection,
      };
    },

    hook_admin() {
      return {
        id: 'nextcloud',
        label: 'Nextcloud',
        icon: Cloud,
        weight: 62,
        pluginId: 'nextcloud_cplug',
        component: NextcloudSettingsSection,
      };
    },

    hook_user_sync({ action, user }) {
      if (action === 'create' || action === 'login') {
        console.log(`[nextcloud] Would provision/sync user ${user?.name || user?.uid} to Nextcloud`);
      }
    },
  },
});

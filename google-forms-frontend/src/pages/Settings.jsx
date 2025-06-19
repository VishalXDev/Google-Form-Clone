import React, { useState } from 'react';
import {
    Settings as SettingsIcon,
    User,
    Bell,
    Lock,
    FileText,
    Shield,
    Save,
    Eye,
    EyeOff,
    Camera,
    Mail,
    Phone,
    Moon,
    Sun,
    Check,
    ChevronRight
} from 'lucide-react';

export default function Settings() {
    const [activeTab, setActiveTab] = useState('profile');
    const [profileData, setProfileData] = useState({
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        bio: 'Form creator and data enthusiast'
    });

    const [notifications, setNotifications] = useState({
        emailResponses: true,
        weeklyReports: true,
        inAppAlerts: false,
        marketingEmails: false,
        securityAlerts: true
    });

    const [privacy, setPrivacy] = useState({
        twoFactor: false,
        publicProfile: true,
        defaultFormPrivacy: 'public',
        dataRetention: '1year'
    });

    const [formPrefs, setFormPrefs] = useState({
        defaultTheme: 'blue',
        autoSave: true,
        responseEditing: true,
        thankYouMessage: 'Thank you for your response!',
        defaultFieldType: 'text'
    });

    const [darkMode, setDarkMode] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [savedMessage, setSavedMessage] = useState('');

    const handleSave = (section) => {
        setSavedMessage(`${section} settings saved successfully!`);
        setTimeout(() => setSavedMessage(''), 3000);
    };

    const TabButton = ({ id, icon: Icon, label, isActive, onClick }) => (
        <button
            onClick={onClick}
            className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-all ${isActive
                    ? 'bg-purple-100 text-purple-700 border-l-4 border-purple-500'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
        >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{label}</span>
            <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${isActive ? 'rotate-90' : ''}`} />
        </button>
    );

    const ToggleSwitch = ({ enabled, onChange, label, description }) => (
        <div className="flex items-center justify-between py-3">
            <div className="flex-1">
                <p className="font-medium text-gray-800">{label}</p>
                {description && <p className="text-sm text-gray-600">{description}</p>}
            </div>
            <button
                onClick={onChange}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-purple-600' : 'bg-gray-300'
                    }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                />
            </button>
        </div>
    );

    const renderProfileSettings = () => (
        <div className="space-y-6">
            <div className="flex items-center space-x-6">
                <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {profileData.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <button className="absolute -bottom-2 -right-2 bg-white border-2 border-gray-300 rounded-full p-2 hover:bg-gray-50 transition-colors">
                        <Camera className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-gray-900">{profileData.name}</h3>
                    <p className="text-gray-600">{profileData.email}</p>
                </div>
            </div>

            <div className="grid gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                </div>
            </div>

            <button
                onClick={() => handleSave('Profile')}
                className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
            </button>
        </div>
    );

    const renderNotificationSettings = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Notifications</h3>
                <div className="space-y-4">
                    <ToggleSwitch
                        enabled={notifications.emailResponses}
                        onChange={() => setNotifications({ ...notifications, emailResponses: !notifications.emailResponses })}
                        label="Form Response Notifications"
                        description="Get notified when someone submits a form"
                    />
                    <ToggleSwitch
                        enabled={notifications.weeklyReports}
                        onChange={() => setNotifications({ ...notifications, weeklyReports: !notifications.weeklyReports })}
                        label="Weekly Analytics Reports"
                        description="Receive weekly performance summaries"
                    />
                    <ToggleSwitch
                        enabled={notifications.marketingEmails}
                        onChange={() => setNotifications({ ...notifications, marketingEmails: !notifications.marketingEmails })}
                        label="Marketing & Product Updates"
                        description="Stay updated with new features and tips"
                    />
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">App Notifications</h3>
                <div className="space-y-4">
                    <ToggleSwitch
                        enabled={notifications.inAppAlerts}
                        onChange={() => setNotifications({ ...notifications, inAppAlerts: !notifications.inAppAlerts })}
                        label="In-App Activity Alerts"
                        description="Show notifications within the app"
                    />
                    <ToggleSwitch
                        enabled={notifications.securityAlerts}
                        onChange={() => setNotifications({ ...notifications, securityAlerts: !notifications.securityAlerts })}
                        label="Security Alerts"
                        description="Important security-related notifications"
                    />
                </div>
            </div>

            <button
                onClick={() => handleSave('Notification')}
                className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
                <Save className="w-4 h-4" />
                <span>Save Preferences</span>
            </button>
        </div>
    );

    const renderPrivacySettings = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
                <div className="space-y-4">
                    <ToggleSwitch
                        enabled={privacy.twoFactor}
                        onChange={() => setPrivacy({ ...privacy, twoFactor: !privacy.twoFactor })}
                        label="Two-Factor Authentication"
                        description="Add an extra layer of security to your account"
                    />

                    <div className="border-t pt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Change Password</label>
                        <div className="grid gap-3">
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Current password"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10"
                                />
                                <button
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            <input
                                type="password"
                                placeholder="New password"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            <input
                                type="password"
                                placeholder="Confirm new password"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy</h3>
                <div className="space-y-4">
                    <ToggleSwitch
                        enabled={privacy.publicProfile}
                        onChange={() => setPrivacy({ ...privacy, publicProfile: !privacy.publicProfile })}
                        label="Public Profile"
                        description="Allow others to find your public forms"
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Default Form Privacy</label>
                        <select
                            value={privacy.defaultFormPrivacy}
                            onChange={(e) => setPrivacy({ ...privacy, defaultFormPrivacy: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            <option value="public">Public</option>
                            <option value="unlisted">Unlisted</option>
                            <option value="private">Private</option>
                        </select>
                    </div>
                </div>
            </div>

            <button
                onClick={() => handleSave('Privacy')}
                className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
                <Save className="w-4 h-4" />
                <span>Save Settings</span>
            </button>
        </div>
    );

    const renderFormSettings = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Form Defaults</h3>
                <div className="grid gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Default Theme</label>
                        <div className="flex space-x-3">
                            {['blue', 'purple', 'green', 'red'].map((color) => (
                                <button
                                    key={color}
                                    onClick={() => setFormPrefs({ ...formPrefs, defaultTheme: color })}
                                    className={`w-8 h-8 rounded-full bg-${color}-500 border-4 transition-all ${formPrefs.defaultTheme === color ? 'border-gray-400 scale-110' : 'border-transparent'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Default Field Type</label>
                        <select
                            value={formPrefs.defaultFieldType}
                            onChange={(e) => setFormPrefs({ ...formPrefs, defaultFieldType: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            <option value="text">Text Input</option>
                            <option value="email">Email</option>
                            <option value="number">Number</option>
                            <option value="select">Multiple Choice</option>
                            <option value="textarea">Long Text</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Default Thank You Message</label>
                        <textarea
                            value={formPrefs.thankYouMessage}
                            onChange={(e) => setFormPrefs({ ...formPrefs, thankYouMessage: e.target.value })}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Form Behavior</h3>
                <div className="space-y-4">
                    <ToggleSwitch
                        enabled={formPrefs.autoSave}
                        onChange={() => setFormPrefs({ ...formPrefs, autoSave: !formPrefs.autoSave })}
                        label="Auto-save Form Drafts"
                        description="Automatically save your work as you build forms"
                    />
                    <ToggleSwitch
                        enabled={formPrefs.responseEditing}
                        onChange={() => setFormPrefs({ ...formPrefs, responseEditing: !formPrefs.responseEditing })}
                        label="Allow Response Editing"
                        description="Let users edit their responses after submission"
                    />
                </div>
            </div>

            <button
                onClick={() => handleSave('Form')}
                className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
                <Save className="w-4 h-4" />
                <span>Save Preferences</span>
            </button>
        </div>
    );

    const tabs = [
        { id: 'profile', icon: User, label: 'Profile' },
        { id: 'notifications', icon: Bell, label: 'Notifications' },
        { id: 'privacy', icon: Lock, label: 'Privacy & Security' },
        { id: 'forms', icon: FileText, label: 'Form Preferences' }
    ];

    return (
        <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <SettingsIcon className="w-8 h-8 text-purple-600" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
                            <p className="text-gray-600">Configure your account preferences and privacy options</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Success Message */}
            {savedMessage && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-green-800">{savedMessage}</span>
                </div>
            )}

            {/* Main Content */}
            <div className="grid lg:grid-cols-4 gap-6">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <nav className="space-y-2">
                            {tabs.map((tab) => (
                                <TabButton
                                    key={tab.id}
                                    id={tab.id}
                                    icon={tab.icon}
                                    label={tab.label}
                                    isActive={activeTab === tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                />
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        {activeTab === 'profile' && renderProfileSettings()}
                        {activeTab === 'notifications' && renderNotificationSettings()}
                        {activeTab === 'privacy' && renderPrivacySettings()}
                        {activeTab === 'forms' && renderFormSettings()}
                    </div>
                </div>
            </div>

            {/* Coming Soon Features */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold mb-4 text-purple-800 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Coming Soon
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                        <div className="flex items-center text-purple-700">
                            <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                            <span className="text-sm font-medium">Advanced team collaboration</span>
                        </div>
                        <div className="flex items-center text-purple-700">
                            <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                            <span className="text-sm font-medium">Custom domain settings</span>
                        </div>
                        <div className="flex items-center text-purple-700">
                            <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                            <span className="text-sm font-medium">API key management</span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center text-purple-700">
                            <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                            <span className="text-sm font-medium">Language & region settings</span>
                        </div>
                        <div className="flex items-center text-purple-700">
                            <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                            <span className="text-sm font-medium">Data export & backup</span>
                        </div>
                        <div className="flex items-center text-purple-700">
                            <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                            <span className="text-sm font-medium">Single sign-on (SSO)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
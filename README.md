## Chrome OS apps for Office 365

These Chrome app definitions are designed to be published internally to the Chrome Web Store.

Once published, they can be force installed + pinned to the dock for Chrome OS users at login (via the Admin Console).

They allow quick access to the web apps and the Outlook & OneDrive apps allow grouping Chrome tabs of those apps independantly in the dock (click the icon in your dock to go back to your existing Outlook tab directly, for example, rather than it just opening a new one every time).

### Customization

Most of the apps should work as-is without any customisations, with the exception of OneDrive.

Since OneDrive for Office365 is at a unique Sharepoint URL for each organisation, you'll need to edit the `manifest.json` with your URL before generating the zip file and submitting to the Chrome Web Store.

### Screenshot Example

![Screenshot Example of Dock](https://github.com/a1comms/chromeos-apps-for-office365/raw/master/docs/screenshot.png)

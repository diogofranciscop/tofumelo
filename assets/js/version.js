fetch(`/version.json?t=${Date.now()}`)
    .then(response => response.json())
    .then(data => {
        const currentVersion = localStorage.getItem('siteVersion');
        if (data.version !== currentVersion) {
            localStorage.setItem('siteVersion', data.version);
            location.reload(true); // Force reload to get the latest assets
        }
    })
    .catch(error => console.error('Version check failed:', error));

// This function toggles the dark mode for the application
export function toggleDarkMode() {
  // Check if the document currently has the 'dark' class
  if (document.documentElement.classList.contains('dark')) {
    // If it does, remove the 'dark' class to switch to light mode
    document.documentElement.classList.remove('dark');
    // Save the preference in localStorage as 'light'
    localStorage.setItem('theme', 'light');
  } else {
    // If it does not have the 'dark' class, add the 'dark' class to switch to dark mode
    document.documentElement.classList.add('dark');
    // Save the preference in localStorage as 'dark'
    localStorage.setItem('theme', 'dark');
  }
}

// This function initializes the dark mode based on user preference or system settings
export function initializeDarkMode() {
  // Check if the user has a saved preference
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme === 'dark') {
    // If the saved preference is dark, apply dark mode
    document.documentElement.classList.add('dark');
  } else if (savedTheme === 'light') {
    // If the saved preference is light, ensure dark mode is not applied
    document.documentElement.classList.remove('dark');
  } else {
    // If no saved preference, check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }
}

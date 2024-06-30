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

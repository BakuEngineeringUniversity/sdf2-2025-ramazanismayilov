document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mainContent = document.getElementById('mainContent');

    let sidebarOpen = true;

    function toggleSidebar() {
        console.log("salam");
        
        if (sidebarOpen) {
            sidebar.classList.remove('w-64', 'max-w-150');
            sidebar.classList.add('w-0');
            sidebar.style.transform = 'translateX(-100%)';

            mainContent.classList.remove('ml-0');
            mainContent.classList.add('ml-0');

        } else {
            sidebar.classList.remove('w-0');
            sidebar.classList.add('w-64', 'max-w-150');
            sidebar.style.transform = 'translateX(0)';

            mainContent.classList.remove('ml-0');
            mainContent.classList.add('ml-0');

        }

        sidebarOpen = !sidebarOpen;
    }

    sidebarToggle.addEventListener('click', toggleSidebar);

    window.addEventListener('resize', function () {
        if (window.innerWidth < 768) {
            if (sidebarOpen) {
                toggleSidebar();
            }
        }
    });
});
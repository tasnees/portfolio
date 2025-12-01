async function fetchGitHubProjects(username) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=20`);
        
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        
        const repos = await response.json();
        const projectsContainer = document.getElementById('github-projects');
        
        if (!projectsContainer) {
            console.error('github-projects container not found');
            return;
        }
        
        // Filter out forks and sort by stars
        const topRepos = repos
            .filter(repo => !repo.fork)
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, 6);
        
        if (topRepos.length === 0) {
            projectsContainer.innerHTML = '<p class="text-gray-400">No repositories found</p>';
            return;
        }
        
        topRepos.forEach(repo => {
            const projectCard = `
                <a href="${repo.html_url}" target="_blank" 
                   class="card p-6 rounded-lg transition-all duration-300 hover:scale-[1.02]">
                    <h4 class="font-medium mb-2 text-sky-400">${repo.name}</h4>
                    <p class="text-sm text-gray-400 mb-4">${repo.description || 'No description'}</p>
                    <div class="flex items-center justify-between text-xs text-gray-400">
                        <div class="flex space-x-4">
                            <span>⭐ ${repo.stargazers_count}</span>
                            <span>🍴 ${repo.forks_count}</span>
                        </div>
                        <span>${repo.language || 'Various'}</span>
                    </div>
                </a>
            `;
            projectsContainer.innerHTML += projectCard;
        });
        console.log('Successfully loaded', topRepos.length, 'projects');
    } catch (error) {
        console.error('Error fetching GitHub data:', error);
        const projectsContainer = document.getElementById('github-projects');
        if (projectsContainer) {
            projectsContainer.innerHTML = '<p class="text-gray-400">Failed to load projects. Please check the console.</p>';
        }
    }
}

// Fetch GitHub projects when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        fetchGitHubProjects('tasnees');
    });
} else {
    fetchGitHubProjects('tasnees');
}

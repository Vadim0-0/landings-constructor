document.addEventListener('DOMContentLoaded', function() {
    const originalSelect = document.getElementById('langSelect');
    const customSelect = document.querySelector('.custom-select');
    const selectedDiv = document.querySelector('.custom-select__selected');
    const itemsDiv = document.querySelector('.custom-select__list');
    const searchBox = document.querySelector('.search-box');
    
    Array.from(originalSelect.options).forEach(option => {
        const optionDiv = document.createElement('div');
        const flagAndText = option.text.split(' ');
        const flag = flagAndText[0];
        const text = flagAndText.slice(1).join(' '); 
        
        optionDiv.innerHTML = `<span class="flag">${flag}</span> <span class="language-text">${text}</span>`;
        optionDiv.setAttribute('data-value', option.value);
        optionDiv.classList.add('custom-select__list-item');
        optionDiv.setAttribute('data-search-text', text.toLowerCase());
        
        if (option.selected) {
            optionDiv.classList.add('selected');
            selectedDiv.innerHTML = `<span class="flag">${flag}</span> <span class="language-code">${text}</span>`;
        }
        
        optionDiv.addEventListener('click', function() {
            originalSelect.value = option.value;
            
            selectedDiv.innerHTML = this.innerHTML;
            
            document.querySelectorAll('.custom-select__list-item').forEach(div => {
                div.classList.remove('selected');
            });
            
            this.classList.add('selected');
            
            itemsDiv.style.display = 'none';
            selectedDiv.classList.remove('select-arrow-active');
            
            searchBox.value = '';
            filterOptions('');
            
            const event = new Event('change');
            originalSelect.dispatchEvent(event);
        });
        
        itemsDiv.appendChild(optionDiv);
    });
    
    function filterOptions(searchText) {
        const options = itemsDiv.querySelectorAll('.custom-select__list-item');
        let hasVisibleOptions = false;
        
        options.forEach(option => {
            const text = option.getAttribute('data-search-text');
            if (text.includes(searchText.toLowerCase())) {
                option.style.display = 'flex';
                hasVisibleOptions = true;
            } else {
                option.style.display = 'none';
            }
        });
    }
    
    searchBox.addEventListener('input', function(e) {
        filterOptions(this.value);
    });
    
    selectedDiv.addEventListener('click', function(e) {
        e.stopPropagation();
        itemsDiv.style.display = itemsDiv.style.display === 'block' ? 'none' : 'block';
        selectedDiv.classList.toggle('select-arrow-active');
        
        if (itemsDiv.style.display === 'block') {
            setTimeout(() => {
                searchBox.focus();
                filterOptions('');
            }, 10);
        }
    });
    
    document.addEventListener('click', function() {
        itemsDiv.style.display = 'none';
        selectedDiv.classList.remove('select-arrow-active');
        searchBox.value = ''; 
        filterOptions(''); 
    });
    
    itemsDiv.addEventListener('keydown', function(e) {
        const visibleOptions = Array.from(itemsDiv.querySelectorAll('.custom-select__list-item')).filter(opt => 
            opt.style.display !== 'none'
        );
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const currentIndex = visibleOptions.findIndex(opt => opt.classList.contains('selected'));
            let nextIndex = 0;
            
            if (currentIndex >= 0) {
                nextIndex = (currentIndex + 1) % visibleOptions.length;
            }
            
            visibleOptions.forEach(opt => opt.classList.remove('selected'));
            visibleOptions[nextIndex].classList.add('selected');
            visibleOptions[nextIndex].scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const currentIndex = visibleOptions.findIndex(opt => opt.classList.contains('selected'));
            let prevIndex = visibleOptions.length - 1;
            
            if (currentIndex > 0) {
                prevIndex = currentIndex - 1;
            } else if (currentIndex === 0) {
                prevIndex = visibleOptions.length - 1;
            }
            
            visibleOptions.forEach(opt => opt.classList.remove('selected'));
            visibleOptions[prevIndex].classList.add('selected');
            visibleOptions[prevIndex].scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const selectedOption = itemsDiv.querySelector('.custom-select__list-item.selected');
            if (selectedOption) {
                selectedOption.click();
            }
        }
    });
    
    searchBox.addEventListener('click', function(e) {
        e.stopPropagation();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const html = document.querySelector('html');

    const getAvailableLanguages = () => {
        const langElements = document.querySelectorAll('[data-lang]');
        const languages = new Set();
        langElements.forEach((langElement) => {
            languages.add(langElement.getAttribute('data-lang'));
        });
        return Array.from(languages);
    };

    const detectLanguage = () => {
        const availableLanguages = getAvailableLanguages();
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang && availableLanguages.includes(urlLang)) {
            return urlLang;
        }
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0];
        return availableLanguages.includes(langCode) ? langCode : 'en';
    };

    const initLanguage = (lang) => {
        document.querySelectorAll('[data-lang]').forEach((element) => {
            if (element.tagName.toLowerCase() === 'html') return;
            if (element.getAttribute('data-lang') === lang) {
                element.style.display = '';
            } else {
                element.style.display = 'none';
            }
        });
        html.setAttribute('data-lang', lang);
    };

    const initLanguageSwitcher = (gameInstance = null) => {
        const currentLang = detectLanguage();
        html.setAttribute('data-lang', currentLang);
        initLanguage(currentLang);
        const langSelect = document.getElementById('langSelect');
        if (langSelect) {
            langSelect.value = currentLang;
            langSelect.addEventListener('change', (event) => {
                const newLang = event.target.value;
                initLanguage(newLang);
                if (gameInstance && gameInstance.currentLang !== undefined) {
                    gameInstance.currentLang = newLang;
                }
            });
        }
        return currentLang;
    };

    initLanguageSwitcher();
});
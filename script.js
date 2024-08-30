            textArea.style.top = '0';
            textArea.style.left = '0';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    copyStatus.classList.remove('hidden');
                    setTimeout(() => copyStatus.classList.add('hidden'), 2000);
                }
            } catch (err) {
                console.error('Fallback: Oops, unable to copy', err);
            }

            document.body.removeChild(textArea);
        }
    };
});

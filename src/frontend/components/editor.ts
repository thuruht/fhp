import Quill from 'quill';

export function createRichTextEditor(initialContent: string, onChange: (content: string) => void) {
    const wrapper = document.createElement('div');
    wrapper.className = 'editor-wrapper';

    const editorContainer = document.createElement('div');
    wrapper.appendChild(editorContainer);

    let quill: Quill | null = null;

    setTimeout(() => {
        quill = new Quill(editorContainer, {
            theme: 'snow',
            modules: {
                toolbar: {
                    container: [
                        ['bold', 'italic'],
                        [{ 'header': 2 }],
                        ['image']
                    ],
                    handlers: {
                        image: imageHandler
                    }
                }
            }
        });

        if (initialContent) {
            quill.root.innerHTML = initialContent;
        }

        quill.on('text-change', () => {
            if (quill) onChange(quill.root.innerHTML);
        });

        function imageHandler() {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');
            input.click();

            input.onchange = async () => {
                const file = input.files ? input.files[0] : null;
                if (!file) return;

                const formData = new FormData();
                formData.append('file', file);

                try {
                    const res = await fetch('/api/upload', {
                        method: 'POST',
                        body: formData
                    });

                    if (res.ok) {
                        const data = await res.json();
                        if (quill) {
                            const range = quill.getSelection(true);
                            quill.insertEmbed(range.index, 'image', data.url);
                        }
                    } else {
                        console.error('Upload failed');
                    }
                } catch (e) {
                    console.error('Error uploading image', e);
                }
            };
        }

    }, 0);

    return {
        element: wrapper,
        setHTML: (html: string) => {
            // If quill is initialized, set it, otherwise wait or ignore (race condition mostly covered by usage)
            if (quill) {
                quill.root.innerHTML = html;
            } else {
                // If setHTML is called before init, we update the initialContent closure variable?
                // Or just retry. Since initialContent is used in the timeout, we should rely on it there.
                // But for reset purposes, the timeout has likely run.
                 const check = setInterval(() => {
                     if (quill) {
                         quill.root.innerHTML = html;
                         clearInterval(check);
                     }
                 }, 10);
            }
        }
    };
}

import { setState } from '../state';

export function renderLogin() {
    const container = document.createElement('div');
    container.className = 'login-container';

    const logo = document.createElement('img');
    logo.src = '/logo.png';
    logo.alt = 'Flaming Heart Productions';
    logo.className = 'login-logo';
    container.appendChild(logo);

    const title = document.createElement('h1');
    title.textContent = 'ADMIN ACCESS';
    container.appendChild(title);

    const form = document.createElement('form');
    form.className = 'login-form';

    const input = document.createElement('input');
    input.type = 'password';
    input.placeholder = 'password';
    input.required = true;
    form.appendChild(input);

    const errorMsg = document.createElement('p');
    errorMsg.className = 'error';
    form.appendChild(errorMsg);

    const actions = document.createElement('div');
    actions.className = 'login-actions';

    const loginBtn = document.createElement('button');
    loginBtn.type = 'submit';
    loginBtn.textContent = 'LOGIN';
    actions.appendChild(loginBtn);

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.textContent = 'CANCEL';
    cancelBtn.onclick = () => setState({ page: 'home' });
    actions.appendChild(cancelBtn);

    form.appendChild(actions);

    form.onsubmit = async (e) => {
        e.preventDefault();
        errorMsg.textContent = '';

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: input.value }),
            });

            if (res.ok) {
                setState({ isAuthenticated: true, page: 'admin' });
            } else {
                errorMsg.textContent = 'invalid credentials';
            }
        } catch (error) {
            errorMsg.textContent = 'network error';
        }
    };

    container.appendChild(form);
    return container;
}

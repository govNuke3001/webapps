class AuthService {
  constructor() {
    this.currentUser = null;
  }

  async login(email, password) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (email && password) {
      this.currentUser = {
        id: 'user123',
        name: 'Иван Иванов',
        email: email,
      };
      localStorage.setItem('user', JSON.stringify(this.currentUser));
      return this.currentUser;
    }
    throw new Error('Неверные учетные данные');
  }

  async register(name, email, password) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    this.currentUser = {
      id: Date.now().toString(),
      name,
      email,
    };
    localStorage.setItem('user', JSON.stringify(this.currentUser));
    return this.currentUser;
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    if (!this.currentUser) {
      const stored = localStorage.getItem('user');
      if (stored) {
        this.currentUser = JSON.parse(stored);
      }
    }
    return this.currentUser;
  }

  isAuthenticated() {
    return !!this.getCurrentUser();
  }
}

export const authService = new AuthService();
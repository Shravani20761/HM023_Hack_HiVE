// Mock Authentication Service for Demo/Testing
// This bypasses the real Appwrite backend for temporary testing

const DEMO_USER = {
    $id: 'demo-user-123',
    name: 'Demo User',
    email: 'demo@hackhive.com',
    $createdAt: new Date().toISOString(),
    $updatedAt: new Date().toISOString()
};

// Demo credentials
const DEMO_CREDENTIALS = {
    email: 'demo@hackhive.com',
    password: 'demo123'
};

export class MockAuthService {
    currentUser = null;
    isLoggedIn = false;

    async createAccount({ email, password, name }) {
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            // Create a mock user
            this.currentUser = {
                $id: 'user-' + Date.now(),
                name: name,
                email: email,
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString()
            };
            this.isLoggedIn = true;

            // Store in localStorage for persistence
            localStorage.setItem('mockUser', JSON.stringify(this.currentUser));
            localStorage.setItem('mockSession', 'true');

            return { success: true };
        } catch (error) {
            throw new Error('Failed to create account');
        }
    }

    async login({ email, password }) {
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            // Check demo credentials
            if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
                this.currentUser = DEMO_USER;
                this.isLoggedIn = true;

                // Store in localStorage for persistence
                localStorage.setItem('mockUser', JSON.stringify(this.currentUser));
                localStorage.setItem('mockSession', 'true');

                return { success: true };
            } else {
                throw new Error('Invalid email or password. Try: demo@hackhive.com / demo123');
            }
        } catch (error) {
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            // Check if user is stored in localStorage
            const storedUser = localStorage.getItem('mockUser');
            const storedSession = localStorage.getItem('mockSession');

            if (storedSession && storedUser) {
                this.currentUser = JSON.parse(storedUser);
                this.isLoggedIn = true;
                return this.currentUser;
            }

            if (this.isLoggedIn && this.currentUser) {
                return this.currentUser;
            }

            return null;
        } catch (error) {
            console.log("Mock Auth :: getCurrentUser :: error", error);
            return null;
        }
    }

    async logout() {
        try {
            this.currentUser = null;
            this.isLoggedIn = false;

            // Clear localStorage
            localStorage.removeItem('mockUser');
            localStorage.removeItem('mockSession');
        } catch (error) {
            console.log("Mock Auth :: logout :: error", error);
        }
    }
}

const mockAuthService = new MockAuthService();

export default mockAuthService;

import axios from 'axios';

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';

// Calls Auth Service to check whether a given userId exists.
// Returns the user object if found, or null if not found / on error.

export const verifyUserExists = async (userId: number, token: string) => {
    try{
        
        const response = await axios.get(`${AUTH_SERVICE_URL}/api/auth/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.user;

    } catch(error){
        return null;
    }
}


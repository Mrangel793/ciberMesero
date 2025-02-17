<template>
    <button @click="logout"
        class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Cerra Sesión</button>
</template>

<script lang="ts" setup>
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebaseConfig';

const logout = async () => {
    try{
        await signOut(auth);
        console.log('User logged out');
    } catch (error:any) {
        console.log(error.response.data.message);
    }

    return {
        logout
    }
}

</script>
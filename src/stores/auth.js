import { csrfCookie,login,getUser,logout,register } from "@/components/api/auth-api";
import { defineStore } from "pinia";
import { ref,computed } from "vue";

export const useAuthStore = defineStore("authStore", ()=>{
    
    const user = ref(null);
    const errors = ref(null);

    const authDialog = ref(false);

    const d = ref();
    const s = ref();

    const isLoggedIn = computed(()=> !!user.value);
    // const isLoggedIn = computed(()=> true );
 
    const handleLogin = async (credentials) => {
      
        await csrfCookie();

        try {
            // await login(credentials);
            const {data,status} = await login(credentials);
            d.value = data;
            s.value = status;

            console.log(data,status);

            await fetchUser();
            authDialog.value = false;

        }catch(error){
            user.value = null;
            // console.log(error.response.data,error.response.status);
            d.value = error.response.data.errors;
            s.value = error.response.status;
        }
        // console.log(user.value);
        // console.log(!user.value,!!user.value);
        return { 
            d : d.value,
            s : s.value
        };
    }

    const fetchUser = async() => {
        try {
            const { data } = await getUser();
        
            user.value = data;
        } catch(error){
            user.value = null;
        }
    }

    const authDialogSetter = (isVisible) => {
        authDialog.value = isVisible;
    }

    const handleLogout = async () => {
        await logout();
        user.value = null;
    };

    const handleRegister = async () => {

    };

    return  {
        user,
        isLoggedIn,
        handleLogin,
        errors,
        authDialogSetter,
        fetchUser,
        authDialog,
        handleLogout,
        handleRegister
    }
});


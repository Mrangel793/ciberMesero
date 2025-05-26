import { ref } from 'vue';
import type { TeamMember } from '@/core/entities/TeamMember';
import { FirebaseTeamRepository } from '@/data/repositories/FirebaseTeamRepository';

//import Usecases
import { CreateTeamMemberUseCase } from '@/core/usecases/CreateTeamMemberUseCase';
import { GetAllTeamMembersUseCase } from '@/core/usecases/GetAllTeamMembersUseCase';
import { UpdateTeamMemberUseCase } from '@/core/usecases/UpdateTeamMemberUseCase';
import { DeleteTeamMemberUseCase } from '@/core/usecases/DeleteTeamMemberUseCase';
import { GetTeamMemberByIdUseCase } from '@/core/usecases/GetTeamMemberByIdUseCase';

const teamRepository = new FirebaseTeamRepository();

// Usecases instances
const createTeamMemberUseCase = new CreateTeamMemberUseCase(teamRepository);
const getAllTeamMembersUseCase = new GetAllTeamMembersUseCase(teamRepository);
const updateTeamMemberUseCase = new UpdateTeamMemberUseCase(teamRepository);
const deleteTeamMemberUseCase = new DeleteTeamMemberUseCase(teamRepository);
const getTeamMemberByIdUseCase = new GetTeamMemberByIdUseCase(teamRepository);

export function useTeamManagement() {
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const teamMembers = ref<TeamMember[]>([]);
  const currentMember = ref<TeamMember | null>(null);

  // Función para crear un nuevo empleado
  async function crearEmpleado(memberData: Omit<TeamMember, 'id'>) {
    loading.value = true;
    error.value = null;

    try {
      const newId = await createTeamMemberUseCase.execute(memberData);
      console.log('Empleado creado con ID:', newId);
      await fetchAllTeamMembers();
      return newId;
    } catch (err) {
      error.value = err as Error;
      console.error('Error al crear el empleado:', error.value);
    } finally {
      loading.value = false;
    }
  }

  // Funcion para obtener todos los empleados
  async function fetchAllTeamMembers() {
    loading.value = true;
    error.value = null;

    try {
      teamMembers.value = await getAllTeamMembersUseCase.execute();
    } catch (err) {
      error.value = err as Error;
      console.error('Error al obtener los empleados:', error.value);
    } finally {
      loading.value = false;
    }
  }


  // Esta función obtiene un miembro del equipo por su ID
  async function fetchTeamMemberById(id: string) {
    loading.value = true;
    error.value = null;
    try {
      currentMember.value = await getTeamMemberByIdUseCase.execute(id);
      return currentMember.value;
    } catch (err) {
      error.value = err as Error;
      console.error(`Error fetching member ${id}:`, err);
      currentMember.value = null;
    } finally {
      loading.value = false;
    }
    return null;
  }

  // Esta función actualiza un miembro del equipo
  async function updateTeamMember(id: string, memberData: Partial<TeamMember>) {
    loading.value = true;
    error.value = null;
    try {
      await updateTeamMemberUseCase.execute(id, memberData);
      // Opcional: recargar la lista o actualizar localmente
      await fetchAllTeamMembers();
    } catch (err) {
      error.value = err as Error;
      console.error("Error updating member:", err);
      throw err; // Re-lanzar para que el componente lo maneje si es necesario
    } finally {
      loading.value = false;
    }
  }

  // Esta función elimina un miembro del equipo
  async function deleteTeamMember(id: string) {
    loading.value = true;
    error.value = null;
    try {
      await deleteTeamMemberUseCase.execute(id);
      // Opcional: recargar la lista o eliminar localmente
      await fetchAllTeamMembers();
    } catch (err) {
      error.value = err as Error;
      console.error("Error deleting member:", err);
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    error,
    teamMembers, // Para la lista
    currentMember, // Para el formulario de edición
    crearEmpleado, // Tu función existente
    fetchAllTeamMembers,
    fetchTeamMemberById,
    updateTeamMember,
    deleteTeamMember,
  };

}

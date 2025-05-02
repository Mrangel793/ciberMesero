import { ExcelPlatoRepository } from '@/data/repositories/ExcelPlatoRepository';
import { FirebaseMenuRepository } from '@/data/repositories/FirebaseMenuRepository';
import { ref } from 'vue';
import type { MenuItem } from '@/core/interfaces/MenuItem';

const excelRepo = new ExcelPlatoRepository();
const firebaseRepo = new FirebaseMenuRepository();

export const useImportarPlatos = () => {
  const error = ref('');
  const success = ref('');

  const importarYGuardar = async (file: File, uidRestaurante: string) => {
    try {
      error.value = '';
      const platos: MenuItem[] = await excelRepo.importarDesdeExcel(file);
      await firebaseRepo.guardarMenu(uidRestaurante, platos);
      success.value = '¡Menú importado correctamente!';
      return platos;
    } catch (e) {
      error.value = 'Hubo un error al importar el archivo';
      console.error(e);
      return [];
    }
  };

  return {
    importarYGuardar,
    error,
    success
  };
};


import { useMutation } from "@tanstack/react-query";
import { changePasswordService } from "../services/passwordService";

const useChangePassword = () => {
  return useMutation({
    mutationFn: changePasswordService,
  });
};

export default useChangePassword;

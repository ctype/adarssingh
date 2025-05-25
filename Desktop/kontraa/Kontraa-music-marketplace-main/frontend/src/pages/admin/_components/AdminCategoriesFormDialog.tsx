import { PropsWithChildren } from "react";

import CustomInput from "@/components/form/CustomInput";
import { FormDialog, IFormDialogProps } from "@/components/form/FormDialog";

interface IAdminCategoriesFormDialogProps extends IFormDialogProps {
  data?:
    | Genre
    | Instrument
    | Key
    | SubGenre
    | MoodType
    | PresetType
    | GenreMix
    | PhotoVideoCategory
    | Language
    | Offer
    | SocialAccountType;
}

export function AdminCategoriesFormDialog(
  props: PropsWithChildren<IAdminCategoriesFormDialogProps>
) {
  const { data, children } = props;

  return (
    <FormDialog {...props}>
      <CustomInput
        name="id"
        label=""
        defaultValue={data?.id.toString()}
        placeholder=""
        required={false}
        type="hidden"
      />
      {children}
    </FormDialog>
  );
}

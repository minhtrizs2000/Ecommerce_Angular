import ISelectOption from "./ISelectOption";
import {
NonLabel,
AoLabel,
BaloLabel,
QuanLabel,
AoKhoacLabel,
NonValue,
AoValue,
BaloValue,
QuanValue,
AoKhoacValue
} from "./category/CategoryConstants";
export const CategoriesTypeOptions: ISelectOption[] = [
    { id: 1, label: NonLabel, value: NonValue },
    { id: 2, label: AoLabel, value: AoValue },
    { id: 3, label: BaloLabel, value: BaloValue },
    { id: 4, label: QuanLabel, value: QuanValue },
    { id: 5, label: AoKhoacLabel, value: AoKhoacValue },
  ];
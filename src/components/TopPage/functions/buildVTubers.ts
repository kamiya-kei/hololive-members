import { vTubers as vTubersData } from '../constants';
import { TSortType } from './storages';

export type VTuberData = (typeof vTubersData)[number] & {
  msg: string;
  msg2: string;
  msg0: string;
  class: string;
};

const extraction_date = (s: string) => s.split('-').slice(1).join('/');

const buildBySortGroup = (): VTuberData[] => {
  const newVTubers: VTuberData[] = vTubersData.map((v) => ({
    ...v,
    msg: ((s) => `${s[0]}年${s[1]}月${s[2]}日デビュー`)(v.debut.split(' ')[0].split('-')),
    msg2: ((s) => `誕生日:${s[0]}月${s[1]}日`)(v.birthday.split('/')),
    msg0: v.group,
    class: (v.sort / 0.1) % 1 == 0 ? 'cb' : '',
  }));
  newVTubers.sort((a, b) => a.sort - b.sort);
  return newVTubers;
};

const buildBySortDebut = (): VTuberData[] => {
  const newVTubers: VTuberData[] = vTubersData.map((v) => ({
    ...v,
    msg: ((s) => `${s[0]}年${s[1]}月${s[2]}日デビュー`)(v.debut.split(' ')[0].split('-')),
    msg2: ((s) => `誕生日:${s[0]}月${s[1]}日`)(v.birthday.split('/')),
    msg0: v.group,
    class: '',
  }));
  newVTubers.sort((a, b) => new Date(a.debut).getTime() - new Date(b.debut).getTime());
  return newVTubers;
};

const buildBySortDebutDate = (): VTuberData[] => {
  const newVTubers: VTuberData[] = vTubersData.map((v) => ({
    ...v,
    msg: ((s) => `${s[1]}月${s[2]}日デビュー`)(v.debut.split(' ')[0].split('-')),
    msg2: ((s) => `誕生日:${s[0]}月${s[1]}日`)(v.birthday.split('/')),
    msg0: v.group,
    class: '',
  }));
  newVTubers.sort(
    (a, b) => new Date(extraction_date(a.debut)).getTime() - new Date(extraction_date(b.debut)).getTime()
  );
  return newVTubers;
};

const buildBySortBirthday = (): VTuberData[] => {
  const newVTubers: VTuberData[] = vTubersData.map((v) => ({
    ...v,
    msg: ((s) => `誕生日:${s[0]}月${s[1]}日`)(v.birthday.split('/')),
    msg2: '',
    msg0: v.group,
    class: '',
  }));
  newVTubers.sort((a, b) => new Date(a.birthday).getTime() - new Date(b.birthday).getTime());
  return newVTubers;
};

const buildBySortHeight = (): VTuberData[] => {
  const newVTubers: VTuberData[] = vTubersData.map((v) => ({
    ...v,
    msg: `${v.height}cm`,
    msg2: '',
    msg0: v.group,
    class: '',
  }));
  newVTubers.sort((a, b) => a.height - b.height);
  return newVTubers;
};

export const buildVTubers = (sortType: TSortType): VTuberData[] => {
  switch (sortType) {
    case 'group':
      return buildBySortGroup();
    case 'debut':
      return buildBySortDebut();
    case 'debutDate':
      return buildBySortDebutDate();
    case 'birthday':
      return buildBySortBirthday();
    case 'height':
      return buildBySortHeight();
    default:
      throw new Error('invalid sortType');
  }
};

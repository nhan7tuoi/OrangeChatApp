import i18next from '../i18n/i18n';
import {useSelector} from 'react-redux';
export const formatConversation = ({data, userId}) => {
  data.forEach(c => {
    if (c.nameGroup === '') {
      let newName = '';
      const tempMembers = c.members.filter(m => m._id !== userId);
      if (c.isGroup == false) {
        newName = tempMembers[0].name;
        c.image = tempMembers[0].image;
      } else {
        newName =
          i18next.t('ban') +
          ', ' +
          tempMembers[0].name +
          '+ ' +
          (tempMembers.length - 1) +
          ' ' +
          i18next.t('nguoiKhac');
      }
      c.nameGroup = newName;
    }
  });
  return data;
};

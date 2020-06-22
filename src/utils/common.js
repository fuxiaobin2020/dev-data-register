import { MessageBox } from 'element-ui';

const commonfn = {
    // 弹框
    messageBox: function (messagetitle, messagecontent, icon, isConfirm, isCancel = false) {
        let messageData = `<p style="font-family: PingFangSC-Semibold;
    font-size: 24px;color: #333333;letter-spacing: 0;">${messagetitle}</p>
    <p style="font-family: BMWTypeCondensedLight!important;font-size: 16px;color: #333333;letter-spacing: 0;">
    ${messagecontent}</p>`;
        MessageBox.confirm(messageData, "", {
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            type: icon,
            center: true,
            showCancelButton: isCancel,
            showConfirmButton: false,
            dangerouslyUseHTMLString: true
        })
            .then(() => {
            })
            .catch(() => { });
    },
    validPassword(psd) {
        let reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\x00-\xff]{6,10}$/;
        if (!reg.test(psd)) {
            // prompt password should be 6~10 characters which contains uppercase letters,lowercase letters and numbers;
            return false;
        } else {
            return true;
        }
    }
}

export default commonfn

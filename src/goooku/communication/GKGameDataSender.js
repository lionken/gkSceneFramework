var GK_GameDataSender = cc.Class.extend({
    //***********����*************
    mSocketManager: null,

    //**************���к���***********
    /**
     * ���캯��
     * @param aSocketManager socket������
     */
    ctor: function(aSocketManager) {
        if(!aSocketManager) {
            throw "GK_GameSender���캯����������ȷ";
        }

        this.mSocketManager = aSocketManager;
    },

    /**
     * �����������ݸ�ȫ���ֻ�
     * @param aData ���ݣ�JSON��ʽ
     */
    sendGameData: function(aData) {
        this.mSocketManager.sendGameData(aData);
    },

    /**
     * ������Ϸ���
     * @param aResultData ��Ϸ�������
     */
    sendGameResult: function(aResultData) {
        this.mSocketManager.sendGameResult(aResultData);
    },

    /**
     * ���ͻ���
     */
    sendActivityResult: function(aResultData) {
        this.mSocketManager.sendActivityResult(aResultData);
    }});
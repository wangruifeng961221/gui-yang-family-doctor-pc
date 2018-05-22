
//health
var defined = {};

defined.frequencyUnits = [{
        value: '周',
        label: '周'
    },{
        value: '月',
        label: '月'
    },{
        value: '季',
        label: '季'
    },{
        value: '年',
        label: '年'
    }];
defined.statusYes = 1; //已启用
defined.statusNo = 0; //已停用

//签约状态
defined.signStatusNoSign = 0;//未签约
defined.signStatusCancel = -1;//撤消申请
defined.signStatusExamine = 1;//待审核
defined.signStatusSuccess = 3;//已签约
defined.signStatusReject = 4;//已驳回
defined.signStatusSurrender = 5;//已解约


//测量数据类型
defined.recordDataTypeBloodFat = 'MemberBloodFat';//血脂记录
defined.recordDataTypeBloodOxygen = 'MemberBloodOxygen';//血氧记录
defined.recordDataTypeUrine = 'MemberUrine';//尿常规记录
defined.recordDataTypeWeight = 'MemberWeight';//体重记录
defined.recordDataTypeBloodPressure = 'MemeberBloodPressure';//血压记录
defined.recordDataTypeBloodSugar = 'MemeberBloodSugar';//血糖记录
defined.recordDataTypeEcgStruct = 'MemeberEcgStruct';//心电记录
defined.recordDataTypeFat = 'MemeberFat';//脂肪记录

//  随诊病例
defined.FollowCase=1;
defined.PhysicalExamination=2;

// pdf 图片默认
defined.pdfDefault='/img/icon-pdf.png';

// 身份证
defined.idCard=1;




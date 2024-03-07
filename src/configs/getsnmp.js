import snmp from "net-snmp"
// var snmp = require ("net-snmp");
let session = snmp.createSession("172.18.31.205", "publicsctv");
let oids = ["1.3.6.1.2.1.1.3.0"];

// var varbinds = [
//     {
//         oid: "1.3.6.1.2.1.1.1.0",
//         type: snmp.ObjectType.OctetString,
//         value: "host1"
//     },
// ];

const getsnmpDevice = () => {
    // let session = snmp.createSession("172.17.249.34", "public");
    // let oids = [".1.3.6.1.4.1.53273.2.1.4.1.1.4.63",".1.3.6.1.4.1.53273.2.1.4.1.1.4.1"];


    // session.set (varbinds, function (error, varbinds) {
    //     if (error) {
    //         console.error (error.toString ());
    //     } else {
    //         for (var i = 0; i < varbinds.length; i++) {
    //             // for version 1 we can assume all OIDs were successful
    //             console.log (varbinds[i].oid + "|" + varbinds[i].value);

    //             // for version 2c we must check each OID for an error condition
    //             if (snmp.isVarbindError (varbinds[i]))
    //                 console.error (snmp.varbindError (varbinds[i]));
    //             else
    //                 console.log (varbinds[i].oid + "|" + varbinds[i].value);
    //         }
    //     }
    // });


    session.get(oids, function (error, varbinds) {
        if (error) {
            console.error(error);
        } else {
            for (var i = 0; i < varbinds.length; i++) {
                if (snmp.isVarbindError(varbinds[i])) {
                    console.error(snmp.varbindError(varbinds[i]));
                } else {
                    
                    console.log(varbinds[i].oid, " = ", varbinds[i].value);
                    let buf = varbinds[i].value
                    console.log(buf.toString());

                }
            }
        }
        session.close();
    });

    

    function format(seconds){
        function pad(s){
          return (s < 10 ? '0' : '') + s;
        }
        var hours = Math.floor(seconds / (60*60));
        var minutes = Math.floor(seconds % (60*60) / 60);
        var seconds = Math.floor(seconds % 60);
      
        return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
      }
      
    //   var uptime = process.uptime();
    let upTime = format("11457739")
    console.log("upTime: ", upTime)

    // session.get (oids, function (error, varbinds) {
    //     if (error) {
    //         console.error (error.toString ());
    //     } else {
    //         if (varbinds[0].type != snmp.ErrorStatus.NoSuchObject
    //                 && varbinds[0].type != snmp.ErrorStatus.NoSuchInstance
    //                 && varbinds[0].type != snmp.ErrorStatus.EndOfMibView) {
    //             var sysName = varbinds[0].value;
    //             console.log(varbinds[0].oid, " = ", varbinds[0].value);
    //         } else {
    //             console.error (snmp.ObjectType[varbinds[0].type] , ": "
    //                     , varbinds[0].oid);
    //         }
    //     }
    // });
}

export default getsnmpDevice

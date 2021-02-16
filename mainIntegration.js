


// (() => {
//     //  For grafana Please Enable 1111
//     $(() => {

//         let token;

//         $('#tokenButton').click(() => {
//             getToken()
//                 .then(response => {
//                     token == response;
//                     $('#accessToken').val('Ready!').css({ 'background-color': '#7FFFD4', 'color': 'white', 'font-size': '90%' });
//                     token = response;
//                     // console.log('Token:' + token);
//                 })
//                 .catch(err => {
//                     $('#accessToken').val('Error').css({ 'background-color': 'red', 'color': 'white', 'font-size': '90%' });
//                     console.log(err)
//                 })
//         });

//         $('#suspendCustomer').click(() => {
//             let customerForAction = {
//                 'customerId': $('#customerIdForsuspend').val(),
//                 'action': $('#suspendSelect').val(),
//                 'token': token
//             };
//             console.log(customerForAction);
//             let errors = validationSuspendCus(customerForAction);
//             if (errors) {
//                 alert(errors);
//                 return;
//             };

//             let urlForAction = `${environment}/api/URL_FOR_EXAMLE_?customerId=${customerForAction.customerId}&suspend=${customerForAction.action}`;
//             console.log(urlForAction)
//             sendToServerSuspendRequest(urlForAction, customerForAction.token)
//                 .then(response => {
//                     console.log(response);

//                     $('#suspendCustomerResponse').html(`Customer ${response.data.id}, is suspended: ${response.data.isSuspended}!`).css({ 'background-color': 'green', 'color': 'white', 'font-size': '90%' });
//                     // fadeOutExpiryPosRequest('#cancelPositionResponse');
//                 })
//                 .catch(err => {
//                     console.log(err);
//                     $('#suspendCustomerResponse').html(err).css({ 'background-color': 'red', 'color': 'white', 'font-size': '90%' });
//                     console.log("step send request to server to update balance!");
//                     // fadeOutExpiryPosRequest('#cancelPositionResponse');
//                 })
//         });

//         $('#balAdjustmentButton').click(() => {
//             console.log(token);
//             let request = {
//                 'customerId': $('#customerIdAdjustment').val(),
//                 'amount': $('#amountAdjustment').val(),
//                 'comment': $('#commentInput').val(),
//                 'token': token
//             }

//             let errors = validationAdjusDetails(request);
//             if (errors) {
//                 alert(errors);
//                 return;
//             };

//             let confirmBalAdjus = confirm("Are you sure you want to update the balance?");

//             if (confirmBalAdjus) {
//                 let urlForUpdate = `${environment}/api/URL_FOR_EXAMPLE_UPDATE_BALANCE?customerId=${request.customerId}&comment=${request.comment}&amount=${request.amount}`;
//                 sendToServerBalAdjustement(urlForUpdate, token)
//                     .then(response => {
//                         console.log(response);
//                         let parseResponse = JSON.parse(response.data);
//                         console.log(parseResponse);
//                         if (response.success) {
//                             $('#balAdjustmentResponse').html(`Balance updated!Customer ID:${parseResponse.customerId}, Current Balanace:${parseResponse.balance}`).css({ 'background-color': 'green', 'color': 'white', 'font-size': '90%' });
//                             // fadeOutExpiryPosRequest('#balAdjustmentResponse');
//                         } else { $('#balAdjustmentResponse').html(response.error.message).css({ 'background-color': 'red', 'color': 'white', 'font-size': '90%' }); }
//                     })
//                     .catch(err => {
//                         console.log(err.responseText);
//                         $('#balAdjustmentResponse').html('Error').css({ 'background-color': 'red', 'color': 'white', 'font-size': '90%' });
//                         console.log("step send request to server to update balance!");
//                         // fadeOutExpiryPosRequest('#balAdjustmentResponse');
//                     })
//             }
//         });



//         //  Cheking enviroment for specific URL to get token by enviroment

//         // 1111
//         let environmentForAutentication;
//         let enviromentForP;
//         // let environment = 'https://integration-at-service.betc.io';
//         if (`${environment}` == 'integration_URL') {
//             environmentForAutentication = 'integration_authentication_URL';
//             enviromentForP = 'Integration';
//         } else if (`${environment}` == `PRODUCTION_URL`) {
//             environmentForAutentication = 'production_authentication';
//             enviromentForP = 'Production';
//         }
//         else return;
//         $('#environmentP').html(enviromentForP).css({ 'background-color': 'green', 'color': 'white', 'font-size': '100%', 'text-align': 'center' });
//         console.log(environmentForAutentication);


//         function getToken() {
//             return new Promise((resolve, reject) => {
//                 $.ajax({
//                     url: `authentication-environment_URL`
//                     , type: 'POST'
//                     , contentType: 'application/json'
//                     , data: JSON.stringify({
//                         "email": "test@test.com",
//                         "password": "test"
//                     })
//                     , success: function (response) {
//                         resolve(response.data.accessToken);
//                     }
//                 })
//                     .fail(err => reject(err))
//             });
//         };
//     });



//     function sendToServerBalAdjustement(url, token) {
//         console.log(url);
//         return new Promise((resolve, reject) => {
//             $.ajax({
//                 url: `${url}`
//                 , type: 'POST'
//                 , contentType: 'application/json'
//                 , headers: {
//                     Authorization: 'Bearer ' + token
//                 }
//                 , success: function (response) {
//                     console.log(response);
//                     resolve(response);
//                 }
//             })
//                 .fail(err => { reject(err); console.log(err) })
//         })
//     }

//     function sendToServerSuspendRequest(url, token) {
//         return new Promise((resolve, reject) => {
//             $.ajax({
//                 url: `${url}`
//                 , type: 'POST'
//                 , contentType: 'application/json'
//                 , headers: {
//                     Authorization: 'Bearer ' + token
//                 }
//                 , success: function (response) {
//                     console.log(response);
//                     resolve(response);
//                 }
//             })
//                 .fail(err => reject(err))
//         })
//     }


//     // Validation Suspend Customer Object
//     function validationSuspendCus(obj) {
//         console.log(obj);
//         let errors;
//         if (obj.customerId == '') { errors = 'Insert Customer ID!' }
//         else if (obj.action == null) { errors = 'Select Action!' }
//         else if (obj.token == null) { errors = 'Get Access token!' }
//         else { errors = false; }
//         return errors;
//     };

//     // Validation Balance Adjustment Value
//     function validationAdjusDetails(value) {
//         let errors;
//         console.log(value.token);
//         // console.log(token);
//         if (value.customerId == "") { errors = "Insert Customer Id!"; console.log('Insert Customer Id') }
//         else if (value.amount == '') { errors = "Insert amount!"; console.log('Insertamount') }
//         else if (value.comment == '') { errors = 'Insert Comment!'; console.log('Insert comment') }
//         else if (value.token == null || value.token == undefined || value.token == '') { errors = 'Get Access Token!'; console.log('Insert token') }
//         else { errors = false }
//         return errors;
//     };


//     function fadeOutExpiryPosRequest(p) {
//         console.log(p)
//         setTimeout(() => {
//             // $('#expiryPosResponse').html('').css({ 'display': 'none' });
//             $(`${p}`).html('').css({ 'display': 'none' });
//         }, 5000);
//     }
// })();


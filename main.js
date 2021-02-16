
(() => {
    //  For grafana Please Enable 1111
    //  Cheking enviroment for specific URL to get token by enviroment

    $(() => {
        let token;
        let botsId = [];
        let environmentForAutentication;
        let enviromentForP;
        let environment = 'INTEGRATION_URL'; // for start

        if (`${environment}` == 'INTEGRATION_URL') {
            environmentForAutentication = 'integration_SERVICE';
            botsId = [1]; // enable array variable with bot id's, from integration
            enviromentForP = 'Integration';
        } else if (`${environment}` == `PRODUCTION_URL`) {
            environmentForAutentication = 'PRODUCTION_SERVICE_URL';
            botsId = [1] // enable array variable with bot id's, from production
            enviromentForP = 'Production';
        } else return;

        $('#environmentP').html(enviromentForP).css({
            'background-color': 'green',
            'color': 'white',
            'font-size': '100%',
            'text-align': 'center'
        });


        // Checking environment for GET BALANCE
        let checks = checkEnvironmentForGetBalance();
        console.log(checks);
        function checkEnvironmentForGetBalance() {
            let env;
            if (`${environment}` == 'INTEGRATION_URL') {
                env = 'INTEGRATION_SERVICE';
            } else if (`${environment}` == `PRODUCTION_URL`) {
                env = ' PRODUCTION_SERVICE';
            } else { env == null };
            return env;
        }

        // 1. Get Access Token
        $('#tokenButton').click(() => {
            getToken()
                .then(response => {
                    token == response;
                    $('#accessToken').val('Ready!').css({
                        'background-color': '#7FFFD4',
                        'color': 'white',
                        'font-size': '90%'
                    });
                    token = response;
                })
                .catch(err => {
                    $('#accessToken').val('Error').css({
                        'background-color': 'red',
                        'color': 'white',
                        'font-size': '90%'
                    });
                    console.log(err)
                })
        });


        // 2. Suspend Customer
        $('#suspendCustomer').click(() => {

            let customerForAction = {
                'customerId': $('#customerIdForsuspend').val(),
                'action': $('#suspendSelect').val(),
                'token': token
            };

            let errors = validationSuspendCus(customerForAction);
            if (errors) {
                alert(errors);
                return;
            };

            let urlForAction = `${environment}/URL_FOR_BLOCK?customerId=${customerForAction.customerId}&block=${customerForAction.action}`;
            sentToserverRequest(urlForAction, customerForAction.token)
                .then(response => {
                    $('#suspendCustomerResponse').html(`Customer ${response.data.id}, is suspended: ${response.data.isSuspended}!`).css({
                        'background-color': 'green',
                        'color': 'white',
                        'font-size': '90%'
                    });
                })
                .catch(err => {
                    console.log(err);
                    $('#suspendCustomerResponse').html(err).css({
                        'background-color': 'red',
                        'color': 'white',
                        'font-size': '90%'
                    });

                });
            fadeOutExpiryPosRequest('#suspendCustomerResponse');
        });


        // 3.Balance Adjustment
        $('#balAdjustmentButton').click(() => {
            let request = {
                'customerId': $('#customerIdAdjustment').val(),
                'amount': $('#amountAdjustment').val(),
                'comment': $('#commentInput').val(),
                'token': token
            }

            let errors = validationAdjusDetails(request);

            if (errors) {
                alert(errors);
                return;
            };

            let confirmBalAdjus = confirm("Are you sure you want to update the balance?");

            if (confirmBalAdjus) {
                let urlForUpdate = `${environment}/api/v1/URL_UPDATE_BALANCE?customerId=${request.customerId}&text=${request.comment}&amount=${request.amount}`;
                sentToserverRequest(urlForUpdate, token)
                    .then(response => {
                        let parseResponse = JSON.parse(response.data);
                        if (response.success) {
                            $('#balAdjustmentResponse').html(`Balance updated!Customer ID:${parseResponse.customerId}, Current Balanace:${parseResponse.balance}`).css({
                                'background-color': 'green',
                                'color': 'white',
                                'font-size': '90%'
                            });
                            fadeOutExpiryPosRequest('#balAdjustmentResponse');
                        } else {
                            $('#balAdjustmentResponse').html(response.error.message).css({
                                'background-color': 'red',
                                'color': 'white',
                                'font-size': '90%'
                            });
                        }
                    })
                    .catch(err => {
                        $('#balAdjustmentResponse').html('Error').css({
                            'background-color': 'red',
                            'color': 'white',
                            'font-size': '90%'
                        });
                        fadeOutExpiryPosRequest('#balAdjustmentResponse');
                    });

                fadeOutExpiryPosRequest('#balAdjustmentResponse');
            }
        });

        // 4. Enalbe & Disable Instruments
        $('#enableDisableInstrumentButton').click(() => {
            let action = $('#instrumentActionSelect').val();
            let arrayOfInstruments = $('#instrumentIds').val();

            if (action == '' || action == null || arrayOfInstruments == '') {
                alert('Plese fill all details!');
                return;
            } else if (token == null) {
                alert('Get Access token!');
                return;
            };

            let urlForAction = `${environment}/${action}?instrumentIds=${arrayOfInstruments}`;
            sentToserverRequest(urlForAction, token)
                .then(response => {
                    $('#instrumentStatusResponse').html(`Done!`).css({
                        'background-color': 'green',
                        'color': 'white',
                        'font-size': '90%'
                    });

                    fadeOutExpiryPosRequest('#instrumentStatusResponse');
                })
                .catch(err => {
                    $('#instrumentStatusResponse').html('Error').css({
                        'background-color': 'red',
                        'color': 'white',
                        'font-size': '90%'
                    });
                });

            fadeOutExpiryPosRequest('#instrumentStatusResponse');
        });


        //Number 5. GET BALANCE
        $('#getBalance').click(() => {
            let customerId = $('#customerIdGetBalance').val();
            let enviromentGetBalance = checkEnvironmentForGetBalance();

            if (customerId == '') {
                alert('Insert Customer ID!');
                return;
            } else if (token == null) {
                alert('Get Token!');
                return;
            };

            if (enviromentGetBalance == undefined) {
                alert('Env does not exist!!!');
                return;
            }

            let requestURLGetBalance = `${enviromentGetBalance}/api/v1/URL_FOR_SHOW_BALANCE?customerId=${customerId}`;
            getBalanceFromServer(requestURLGetBalance, token)
                .then(response => {
                    $('#currentBalanceP').html(`Customer ${response.customerId}, Current Balance: ${(response.balance)}!`).css({
                        'background-color': 'green',
                        'color': 'white',
                        'font-size': '90%'
                    });
                })
                .catch(err => {
                    $('#currentBalanceP').html('Error').css({
                        'background-color': 'red',
                        'color': 'white',
                        'font-size': '90%'
                    });
                })
            fadeOutExpiryPosRequest('#currentBalanceP');
        });

        // GET BOTS balance
        $('#getBotsBalance').click(() => {
            if (token == null) {
                alert('Get Token!');
                return;
            }
            let enviromentGetBalance = checkEnvironmentForGetBalance();
            let responses = [];
            for (let item of botsId) {
                let requestURLGetBalanceForBot = `${enviromentGetBalance}/api/v1/URL_FOR_SHOW_BALANCE?customerId=${item}`;

                getBalanceFromServer(requestURLGetBalanceForBot, token)
                    .then(response => {
                        responses.push(response);
                        // create function to append table with customers balance
                    })
                    .catch(err => console.log(err))
            }
            setTimeout(() => {
                responses.sort((a, b) => a.customerId - b.customerId);
                showBalancesInTable(responses);
            }, 2000);
        });

        //Create table with balances
        function showBalancesInTable(array) {

            let table = '<table class="table table-striped table-dark" style="width:100%;height:100%;">'
            table += '<tr>';
            do {
                table += `<th><b>Customer ID</b></th>`;
                table += `<th><b>Current Balance From Redis</b></th>`;
            } while (false);

            table += '</tr>'

            for (let i = 0; i < array.length; i++) {
                table += '<tr>';
                table += `<td>${array[i].customerId} </td>`;
                table += `<td>${array[i].balance} USDT</td>`;
                table += '</tr>';
            }
            table += '</table>';
            $('#newTable').append(table);
            $('newTable').append('<hr>');
        }

        function getToken() {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: `${environmentForAutentication}/URL_FOR_Autentication/signin`, //For Grafana, To use in grafana you need enable 1111
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        "email": "test@test.com",
                        "password": "test"
                    }),
                    success: function (response) {
                        resolve(response.data.accessToken);
                    }
                })
                    .fail(err => reject(err))
            });
        };
    });


    function sentToserverRequest(url, token) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${url}`,
                type: 'POST',
                contentType: 'application/json',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                success: function (response) {
                    resolve(response);
                }
            })
                .fail(err => {
                    reject(err);
                })
        })
    };

    // GET  BALANCE REQUEST from Balance Service
    function getBalanceFromServer(url, token) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${url}`,
                type: 'GET',
                contentType: 'application/json',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                success: function (response) {
                    resolve(response);
                }
            })
                .fail(err => {
                    reject(err);
                })
        })
    };

    // Validation Suspend Customer Object
    function validationSuspendCus(obj) {
        let errors;
        if (obj.customerId == '') {
            errors = 'Insert Customer ID!'
        } else if (obj.action == null) {
            errors = 'Select Action!'
        } else if (obj.token == null) {
            errors = 'Get Access token!'
        } else {
            errors = false;
        }
        return errors;
    };

    // Validation Balance Adjustment Value
    function validationAdjusDetails(value) {
        let errors;
        if (value.customerId == "") {
            errors = "Insert Customer Id!";
        } else if (value.amount == '') {
            errors = "Insert amount!";
        } else if (value.comment == '') {
            errors = 'Insert Comment!';
        } else if (value.token == null) {
            errors = 'Get Access Token!';
        } else {
            errors = false
        }
        return errors;
    };


    function fadeOutExpiryPosRequest(p) {
        setTimeout(() => {
            // $('#expiryPosResponse').html('').css({ 'display': 'none' });
            $(`${p}`).html('');
        }, 5000);
    }
})();



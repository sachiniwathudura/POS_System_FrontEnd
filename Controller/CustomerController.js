$(document).ready(function(){
    refresh();
});

document.querySelector('#CustomerManage #customerForm').addEventListener('submit', function(event){
    event.preventDefault();
});

var id;
var name;
var address;
var salary;

$('#CustomerManage .saveBtn').click(function(){
    id = $('#CustomerManage .custId').val();
    name = $('#CustomerManage .custName').val();
    address = $('#CustomerManage .custAddress').val();
    salary = $('#CustomerManage .custSalary').val();

    let customer = {
        id: id,
        name: name,
        address: address,
        salary: salary
    };

    const customerJson = JSON.stringify(customer);
    console.log(customerJson);

    $.ajax({
        url: "http://localhost:8080/POS_BackEnd/customer",
        type: "POST",
        data: customerJson,
        headers: {"Content-Type": "application/json"},
        success: function(res) {
            console.log("Response from server: " + JSON.stringify(res));
            refresh();
        },
        error: function(res) {
            console.error("Error from server: " + JSON.stringify(res));
        }
    });
});

function loadTable(customer){
    $('#CustomerManage .tableRow').append(
        '<tr> ' +
            '<td>' + customer.id + '</td>' +
            '<td>' + customer.name + '</td>' +
            '<td>' + customer.address + '</td>' +
            '<td>' + customer.salary + '</td>' +
        '</tr>' 
    );
}

function extractNumber(id) {
    var match = id.match(/C(\d{2})-(\d{3})/);
    if (match && match.length > 2) {
        return { prefix: parseInt(match[1]), suffix: parseInt(match[2]) };
    }
    return { prefix: 0, suffix: 0 };
}

function createCustomerId() {
    $.ajax({
        url: "http://localhost:8080/POS_BackEnd/customer?function=getAll",
        type: "GET",
        success: function(res) {
            let customers = JSON.parse(res);
            if (!customers || customers.length === 0) {
                $('#CustomerManage .custId').val('C00-001');
            } else {
                let lastCustomer = customers[customers.length - 1];
                let id = lastCustomer && lastCustomer.id ? lastCustomer.id : 'C00-000';
                
                let numbers = extractNumber(id);
                numbers.suffix++;
                if (numbers.suffix > 999) {
                    numbers.prefix++;
                    numbers.suffix = 1;
                }
                $('#CustomerManage .custId').val('C' + numbers.prefix.toString().padStart(2, '0') + '-' + numbers.suffix.toString().padStart(3, '0'));
            }
        },
        error: function(err) {
            console.error("Error from server: " + JSON.stringify(err));
        }
    });
}

function refresh(){
    createCustomerId();
    $('#CustomerManage .custName').val('');
    $('#CustomerManage .custAddress').val('');
    $('#CustomerManage .custSalary').val('');
    $('#CustomerManage .invalidCustId').text('');
    $('#CustomerManage .invalidCustName').text('');
    $('#CustomerManage .invalidCustAddress').text('');

    reloadTable();
}

// Clear button
$('#CustomerManage .clearBtn').click(function(){
    refresh();
});

// Search button
$('#CustomerManage .searchBtn').click(function(){
    let customerId = $('#CustomerManage .custId').val();
    $.ajax({
        url: "http://localhost:8080/POS_BackEnd/customer?function=getById&id=" + customerId,
        type: "GET",
        success: function(res) {
            let customer = JSON.parse(res);
            if (customer) {
                $('#CustomerManage .custName').val(customer.name);
                $('#CustomerManage .custAddress').val(customer.address);
                $('#CustomerManage .custSalary').val(customer.salary);
            } else {
                alert('Customer Not Found');
            }
        },
        error: function(err) {
            console.error("Error from server: " + JSON.stringify(err));
            alert('Customer Not Found');
        }
    });
});

// Update button
$('#CustomerManage .updateBtn').click(function(){
    let UpdateCustomer = {
        id: $('#CustomerManage .custId').val(),
        name: $('#CustomerManage .custName').val(),
        address: $('#CustomerManage .custAddress').val(),
        salary: $('#CustomerManage .custSalary').val()
    };

    const customerJson = JSON.stringify(UpdateCustomer);
    console.log(customerJson);

    $.ajax({
        url: "http://localhost:8080/POS_BackEnd/customer",
        type: "PUT",
        data: customerJson,
        headers: {"Content-Type": "application/json"},
        success: function(res) {
            console.log("Response from server: " + JSON.stringify(res));
            refresh();
        },
        error: function(res) {
            console.error("Error from server: " + JSON.stringify(res));
        }
    });
});

function reloadTable(){
    $.ajax({
        url: "http://localhost:8080/POS_BackEnd/customer?function=getAll",
        type: "GET",
        success: function(res) {
            let customers = JSON.parse(res);
            $('#CustomerManage .tableRow').empty();
            customers.forEach(c => {
                loadTable(c);
            });
        },
        error: function(err) {
            console.error("Error from server: " + JSON.stringify(err));
        }
    });
}

// Remove button
$('#CustomerManage .removeBtn').click(function(){
    let customerId = $('#CustomerManage .custId').val();

    $.ajax({
        url: "http://localhost:8080/POS_BackEnd/customer?id=" + customerId,
        type: "DELETE",
        success: function(res) {
            console.log("Response from server: " + JSON.stringify(res));
            refresh();
        },
        error: function(res) {
            console.error("Error from server: " + JSON.stringify(res));
        }
    });
});

// Table row click
$('#CustomerManage .tableRow').on('click', 'tr', function(){
    let id = $(this).children('td:eq(0)').text();
    let name = $(this).children('td:eq(1)').text();
    let address = $(this).children('td:eq(2)').text();
    let salary = $(this).children('td:eq(3)').text();

    $('#CustomerManage .custId').val(id);
    $('#CustomerManage .custName').val(name);
    $('#CustomerManage .custAddress').val(address);
    $('#CustomerManage .custSalary').val(salary);
});
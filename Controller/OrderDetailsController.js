function od_findOrder(id, callback){
    $.ajax({
        url: "http://localhost:8080/POS_BackEnd/order?function=getById&id="+id,
        method: "get",
        dataType: "json",
        success: function (resp, textStatus, jqXHR){
            callback(resp.order_id);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            callback(null);
        }
    });
}

//====================================
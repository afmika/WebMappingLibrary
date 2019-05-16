function modifQuery(table, object, att_ignore, where, notStringArray) {
    // ex : modif d un objet avec un champs numeroTelephone int
    // modifObject('Personne', obj, 'id', 'id=2', ['numeroTelephone'])
    // retourne une requette sql de modification
    var sql = "UPDATE "+table+" SET ";
    var nbAttrib = 0;
    for(var att in object) nbAttrib++;
    var pos = 0;
    for(var att in object) {
        if(att != att_ignore) {
            var elem = object[att];
            var score = 0;
            for(var k = 0; k < notStringArray.length; k++) {
                if(att == notStringArray[k]) {
                    score++;
                }
            }
            if(score == 0) {
                elem = "'" + elem +"'";
            }
    
            sql += att+" = "+elem+"";
            sql += pos +1 != nbAttrib ? " ," : " ";
        }
        pos++;        
    }
    sql += " WHERE "+where;
    console.log(sql);    
    return sql;
}
function selectQuery(table, where) {
    var sql = "SELECT * FROM "+table+ (where != null ? " WHERE "+where : "");
    console.log(sql);
    return sql;
}
function insertQuery(table, object, notStringArray) {
/*
Exemple
insertQuery('Personne', {
    nom : 'Mika', prenom : 'Fufu', age : 19, numero : 177013
}, ['age', 'numero'])
 */
    var sql = "INSERT INTO "+table+" VALUES (";
    var nbAttrib = 0;
    for(var att in object) nbAttrib++;
    var pos = 0;
    for(var att in object) {
        var elem = object[att];
        var score = 0;
        for(var k = 0; k < notStringArray.length; k++) {
            if(att == notStringArray[k]) {
                score++;
            }
        }
        if(score == 0) {
            elem = "'" + elem +"'";
        }
        sql += elem;
        sql += pos +1 != nbAttrib ? " ," : ")";
        pos++;
    }
    console.log(sql);
    return sql;
}
/*
console.log(modifQuery('Personne', {
    id : 8, nom : 'Mika', prenom : 'Fufu', age : 19, numero : 177013
}, 'id', 'id = 4', ['age', 'numero']));

console.log(insertQuery('Personne', {
    nom : 'Mika', prenom : 'Fufu', age : 19, numero : 177013
}, ['age', 'numero']));

console.log(selectQuery('Personne', 'age<=19'));
*/

module.exports = {
    insertQuery : insertQuery,
    selectQuery : selectQuery,
    modifQuery : modifQuery
}
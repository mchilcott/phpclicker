<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

class question_model
{
    // Database connection (SQLite3 Object)    
    var $db;

    // Init DB connection
    function __construct()
    {
        $this->db = new SQLite3("questions.db");
    }

    // Create the tables in the database
    function install ()
    {
        $this->db->query("CREATE table IF NOT EXISTS responses ("
                         ."ID ROWID,"
                         ."QNum INT,"
                         ."User TEXT,"
                         ."Response TEXT"
                         .");"
                         ."CREATE INDEX IF NOT EXISTS qnum_idx ON responses (QNum);"
        );

        $this->db->query("CREATE table IF NOT EXISTS meta ("
                         ."Property TEXT, Value TEXT);"
                         ."CREATE INDEX IF NOT EXISTS meta_idx ON meta (Property);");

        $this->db->query("INSERT INTO meta (Property, Value) VALUES ('global_qnum', 0)");
         
    }

    // Retrieve the current question number
    function get_question_num(){
        $req = $this->db->query("SELECT Value FROM meta WHERE Property = 'global_qnum'");
        return (int) $req->fetchArray()[0];
           
    }

    // Set the current question number
    function set_question_num ($num) {
        $this->db->query("UPDATE meta SET Value = '".$num."' WHERE Property = 'global_qnum'");
    }

    // Get the response data from a given question number
    function get_responses ($q_num) {
        $req = $this->db->query("SELECT User, Response FROM responses WHERE QNum = ".$q_num.";");
        $output = [];
        while($line = $req->fetchArray(SQLITE3_ASSOC)){
            // Provide a list of users and their answers
            // This also ensures that only the last answer they submit is used
            $output[$line["User"]] = $line["Response"];
        }
        return $output;
    }
    
    // Add a response to the current question by the given user
    function respond ($user, $response){
        $this->db->query("INSERT INTO responses (QNum, User, Response) VALUES ("
                         .$this->get_question_num().","
                         ."'".$user."',"
                         ."'".$response."'"
                         .");");
    }
    
}

$model = new question_model();

if(isset($_REQUEST['response']) && isset($_REQUEST['user']))
{
    // Collect a response
    $model->respond($_REQUEST['user'], $_REQUEST['response']);
}
else if (isset($_REQUEST['retrieve']))
{
    // Retrieve a list of responses
    echo json_encode($model->get_responses($model->get_question_num()));
}
else if (isset($_REQUEST['install']))
{
    // Regenerate the DB - Doesn't clear it
    $model->install();
}
else if (isset($_REQUEST['next']))
{
    // Start the next question
    $model->set_question_num($model->get_question_num() + 1);
}
else if (isset($_REQUEST['question']))
{
    // Check the current question number
    echo $model->get_question_num();
}
else
{
    // Catch all - this shouldn't happen
    echo "Didn't find a valid request. Ignoring.";
}

?>
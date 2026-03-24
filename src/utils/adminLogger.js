import { supabase } from "../lib/supabase";

export async function logAdminAction(action){

await supabase
.from("admin_logs")
.insert([
{
action: action
}
]);

}
import moment from "moment";


export function formatDate(date: Date): string {
  
    if (date) {
        return moment(date).format("YYYY-MM-DD");
    }
   
    return "";
  }
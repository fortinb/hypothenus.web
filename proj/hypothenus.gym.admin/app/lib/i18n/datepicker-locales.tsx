"use client"

import { registerLocale } from "react-datepicker";
import { frCA } from 'date-fns/locale/fr-CA';
import { enUS } from 'date-fns/locale/en-US';

// Date Picker
registerLocale('fr', frCA);
registerLocale('en', enUS);
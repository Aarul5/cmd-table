import {
    Table,
    getTheme,
    THEME_Honeywell,
    THEME_Rounded,
    THEME_DoubleLine,
    THEME_BoldBox,
    THEME_Dots,
    THEME_Void
} from '../src';

function demo(name: string, theme?: any): void {
    console.log(`--- ${name} ---`);
    const table = new Table({ theme });
    table.addColumn('Name');
    table.addColumn('Role');
    table.addRow(['Alice', 'Dev']);
    table.addRow(['Bob', 'PM']);
    console.log(table.render());
    console.log('\n');
}

demo('Default Theme');
demo('Honeywell Theme', THEME_Honeywell);
demo('Rounded Theme', THEME_Rounded);
demo('Double Line Theme', THEME_DoubleLine);
demo('Bold Box Theme', THEME_BoldBox);
demo('Dots Theme', THEME_Dots);
demo('Theme from getTheme("rounded")', getTheme('rounded'));
demo('Void (Borderless) Theme', THEME_Void);

import { Table } from '../src';

// ── Basic emoji table ──────────────────────────────────────────────
const t = new Table();
t.addColumn({ name: 'Icon', minWidth: 4 });
t.addColumn('Name');
t.addColumn('Status');

t.addRow({ Icon: '😀', Name: 'Smile',      Status: 'Happy' });
t.addRow({ Icon: '🚀', Name: 'Rocket',     Status: 'Launched' });
t.addRow({ Icon: '👍🏽', Name: 'Thumbs Up',  Status: 'Approved' });
t.addRow({ Icon: '👨‍👩‍👧‍👦', Name: 'Family',    Status: 'Together' });
t.addRow({ Icon: '❤️', Name: 'Heart',      Status: 'Love' });
t.addRow({ Icon: '⭐', Name: 'Star',       Status: 'Favorite' });

console.log('=== Emoji Table ===\n');
console.log(t.render());

// ── Emoji in status column with formatters ─────────────────────────
const t2 = new Table();
t2.addColumn('Task');
t2.addColumn({
    name: 'Status', key: 'status',
    formatter: (v) => {
        if (v === 'done')       return '✅ Done';
        if (v === 'in-progress') return '🔄 In Progress';
        if (v === 'blocked')    return '❌ Blocked';
        return v;
    }
});
t2.addColumn('Priority');

t2.addRow({ Task: 'Write tests',    status: 'done',        Priority: 'High' });
t2.addRow({ Task: 'Fix bug #42',    status: 'in-progress', Priority: 'Critical' });
t2.addRow({ Task: 'Update docs',    status: 'blocked',     Priority: 'Medium' });
t2.addRow({ Task: 'Deploy v2',      status: 'done',        Priority: 'High' });

console.log('\n=== Emoji Formatters ===\n');
console.log(t2.render());

// ── Mixed emoji + CJK + ASCII ──────────────────────────────────────
const t3 = new Table();
t3.addColumn('Category');
t3.addColumn('Value');

t3.addRow({ Category: '🌍 Region',   Value: 'Asia-Pacific' });
t3.addRow({ Category: '🗣️ Language', Value: '中文 / English' });
t3.addRow({ Category: '📊 Score',    Value: '98.5%' });
t3.addRow({ Category: '🏷️ Tags',    Value: 'TypeScript, CLI' });

console.log('\n=== Mixed Emoji + CJK + ASCII ===\n');
console.log(t3.render());

'use strict';

const extraction_date = (s) => s.split('-').slice(1).join('/');

Vue.config.devtools = true;
const app = new Vue({
    el: '#app',
    data: {
        is_open_link_new_tab: false,
        sort_type: '',
        members: [],
        others: [],
    },
    async created() {
        this.is_open_link_new_tab = localStorage.getItem('is_open_link_new_tab') === '1';
        this.sort_type = localStorage.getItem('sort_type') || 'group';

        const res = await fetch('./data.json');
        const data = await res.json();
        this.members = data.members;
        this.others = data.others;

        this.sort_members();
    },
    watch: {
        sort_type: function () {
            this.sort_members();
            localStorage.setItem('sort_type', this.sort_type);
        },
        is_open_link_new_tab () {
            localStorage.setItem('is_open_link_new_tab', this.is_open_link_new_tab ? '1' : '0');
        }
    },
    computed: {
        'open_link_mode': function () {
            return this.is_open_link_new_tab ? '_blank' : '_self';
        }
    },
    methods: {
        character_bg_img: function (key) {
            return `background-image: url('img/${key}.webp');`;
        },
        sort_members: function () {
            this[`sort_${this.sort_type}`]();
        },
        sort_group: function() {
            this.members.sort((a,b) => a.sort - b.sort);
            [...this.members, ...this.others].forEach(m => {
                m.msg = (s => `${s[0]}年${s[1]}月${s[2]}日デビュー`)(m.debut.split(' ')[0].split('-'));
                m.msg2 = (s => `誕生日:${s[0]}月${s[1]}日`)(m.birthday.split('/'));
                m.msg0 = m.group;
                m.class = (m.sort/0.1) % 1 == 0 ? 'cb' : '';
            });
        },
        sort_debut: function () {
            this.members.sort((a,b) => new Date(a.debut) - new Date(b.debut));
            [...this.members, ...this.others].forEach(m => {
                m.msg = (s => `${s[0]}年${s[1]}月${s[2]}日デビュー`)(m.debut.split(' ')[0].split('-'));
                m.msg2 = (s => `誕生日:${s[0]}月${s[1]}日`)(m.birthday.split('/'));
                m.msg0 = m.group;
                m.class = '';
            });
        },
        sort_debut_date: function () {
            this.members.sort((a,b) => new Date(extraction_date(a.debut)) - new Date(extraction_date(b.debut)));
            [...this.members, ...this.others].forEach(m => {
                m.msg = (s => `${s[1]}月${s[2]}日デビュー`)(m.debut.split(' ')[0].split('-'));
                m.msg2 = (s => `誕生日:${s[0]}月${s[1]}日`)(m.birthday.split('/'));
                m.msg0 = m.group;
                m.class = '';
            });
        },
        sort_birthday: function () {
            this.members.sort((a,b) => new Date(a.birthday) - new Date(b.birthday));
            [...this.members, ...this.others].forEach(m => {
                m.msg = (s => `誕生日:${s[0]}月${s[1]}日`)(m.birthday.split('/'));
                m.msg2 = '';
                m.msg0 = m.group;
                m.class = '';
            });
        },
        sort_height: function () {
            this.members.sort((a,b) => a.height - b.height);
            [...this.members, ...this.others].forEach(m => {
                m.msg = `${m.height}cm`;
                m.msg2 = '';
                m.msg0 = m.group;
                m.class = '';
            });
        },
    }

});


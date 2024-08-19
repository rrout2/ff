enum color {
    white = '#FFFFFF',
    qb = '#FCB040',
    rb = '#32C6F4',
    wr = '#AF76B3',
    te = '#D7DF21',
    red = '#D55455',
    none = 'gray',
}

const positionToColor: {[key: string]: color} = {
    QB: color.qb,
    RB: color.rb,
    WR: color.wr,
    TE: color.te,
    none: color.none,
};

export {color, positionToColor};

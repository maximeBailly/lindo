export const transparentDarkTheme: any = {
    'MultiCSSRules' : {
        'MainContainer' : {
            'selector' : ['.window .windowBorder',],
            'css' : {
                'borderImage' : 'none',
                'border' : '3px solid rgba(0,0,0,0.6)',
                'borderRadius' : '7px',
                'backgroundColor' : 'rgba(0,0,0,0.8)',
                'boxShadow' : 'inset 0px 0px 20px -2px rgba(140,140,140,0.8)',
            }
        },
        'Container' : {
            'selector' : [
                '.window .OrnamentsWindow .col2::before',
                '.window .OrnamentsWindow .col1::before',
                '.window .AlmanaxWindow .col1 .dateBlock::before',
                '.window .AlmanaxWindow .col2 .block::before',
                '.window .QuestsWindow .col1::before',
                '.window .QuestsWindow .col2::before',
                '.window .AchievementsWindow .col1::before',
                '.window .AlignmentWindow .leftColumn .pvpBox::before',
                '.window .AlignmentWindow .rightColumn::before',
                '.window .jobsWindow .jobsList::before',
                '.window .jobsWindow .jobExpBlock::before',
                '.window .jobsWindow .skillsBlock::before',
                '.RecipeList::before',
                '.FriendsWindow .mainPanel::before',
                '.FellowPagesWindow .SwipingTabs .swipeTabContent::before',
                '.window.characteristics .panels::before',
                '.window.ArenaWindow .wrapper::before',
                '.window.ArenaWindow .wrapper::before',
                '.window.ToaWindow .panels .panel .contentBlock::before',
                '.window.ToaWindow .panels .panel .unscrollableContentBlock::before',
                '.HelpWindow .helpBody .col1::before',
                '.HelpWindow .helpBody .col2::before',
                '.window.OptionsWindow .wrapper .settingsCol::before',
                '.window.OptionsWindow .wrapper .menuCol::before',
                '.minMaxSelector::before',
                '.ItemBox::before',
                '.window.tradeItemWindow .windowBody .settingBox::before',
                '.window.padLockWindow .container .keypadContainer::before',
                '.window.padLockWindow .codeContainer::before',
                '.window.BreedingWindow .rightCol .roomBoxes .roomBoxWrapper::before',
            ],
            'css' : {
                'borderImage' : 'none',
                'border' : '2px solid rgba(0,0,0,0.6)',
                'borderRadius' : '7px',
                'backgroundColor' : 'rgba(0,0,0,0.4)',
                'boxShadow' : 'inset 0px 0px 20px -2px rgba(140,140,140,0.8)',
            }
        },
        'ContainerN3' : {
            'selector' : [
                '.window .AlignmentWindow .leftColumn .pvpBox .pvpContainer .Table::before',
                '.window .AlignmentWindow .rightColumn .Table::before',
                '.window .AlignmentWindow .rightColumn .Table::before',
                '.placeholderFrame',
            ],
            'css' : {
                'borderImage' : 'none',
                'border' : '2px solid rgba(0,0,0,0.6)',
                'borderRadius' : '7px',
                'backgroundColor' : 'rgba(0,0,0,0)',
                'boxShadow' : 'inset 0px 0px 20px -2px rgba(140,140,140,0.8)',
            }
        },
        'ContainerVariantLight' : {
            'selector' : [
                '.ItemBox .infoContainer .topRightInfoContainer .itemInfoPanels::before',
                '.CraftActorBox::before',
                '.CraftResultBox::before',
                '.EquipmentDrawer .characterBox::before',
                '.mountBox',
                '#dofusBody .MountDetails .panel::before',
                '#dofusBody .MountDetails .mainContainer::before',
            ],
            'css' : {
                'borderImage' : 'none',
                'border' : '2px solid rgba(0,0,0,0.6)',
                'borderRadius' : '7px',
                'backgroundColor' : 'rgba(125, 125, 125, 0.3)',
                'boxShadow' : 'inset 0px 0px 20px -2px rgba(140,140,140,0.8)',
            }
        },
        'GeneralHeader' : {
            'selector' : [
                '.TableV2 .tableHeader',
                '.window .QuestsWindow .header::before',
                '.Table .container.header',
                '.window.characteristics tr td.tableTitle::before',
                '.HelpWindow .helpBody .col1 .col1Header::before',
                '.ItemBox .itemBox-title::before',
            ],
            'css' : {
                'borderImage' : 'none',
                'border' : '2px solid #3c403b',
                'borderRadius' : '10px 10px 0 0',
                'backgroundColor' : '#3c403bc4',
            }
        },
        'ListOdd' : {
            'selector' : [
                '.window .QuestsWindow .sublist .label.odd',
                '.TableV2 .tableContent .row.odd',
                '.window .AchievementsWindow .col1 .scroll .tree .listItem:nth-of-type(2n) > .label',
                '.List li:nth-child(2n+1) > .label',
                '.window.characteristics tr:nth-child(2n+1) td',
                '.HelpWindow .helpBody .col1 .SingleSelectionList .listItem:nth-child(2n+1) > .label',
                '.HelpWindow .helpBody .col1 .SingleSelectionList .listItem.selected > .sublist > .label:nth-child(2n+1)',
                '.window.OptionsWindow .wrapper .menuCol .menu .listItem.odd',
                '.drillDownList .listItem.odd',
            ],
            'css' : {
                'background-color' : 'rgba(43, 44, 39, 0.5)',
            }
        },
        'FixOpacity' : {
            'selector' : [
                '.FellowAlliancesWindow .filterBox.disabled .filterIcon, .FellowGuildsWindow .filterBox.disabled .filterIcon',
                '.FellowAlliancesWindow .filterBox.disabled .searchBox, .FellowGuildsWindow .filterBox.disabled .searchBox',
            ],
            'css' : {
                'opacity' : '1',
            }
        },
        'BlackBox' : {
            'selector' : [
                '.window .AlmanaxWindow .col1 .dateBlock .dayBg',
                '.generalTab .generalContent .introBlock .col2 .scoreBoxHeaderContentBlock',
                '.generalTab .generalContent .introBlock .col2 .localisationBox',
            ],
            'css' : {
                'backgroundColor' : '#00000087',
            }
        },
        'GrimoireIcon' : {
            'selector' : [
                '.window.GrimoireWindow .windowBody .tab:nth-child(1)::before',
                '.window.GrimoireWindow .windowBody .tab:nth-child(2)::before',
                '.window.GrimoireWindow .windowBody .tab:nth-child(3)::before',
                '.window.GrimoireWindow .windowBody .tab:nth-child(4)::before',
                '.window.GrimoireWindow .windowBody .tab:nth-child(5)::before',
                '.window.GrimoireWindow .windowBody .tab:nth-child(6)::before',
                '.window.GrimoireWindow .windowBody .tab:nth-child(7)::before',
                '.window.GrimoireWindow .windowBody .tab:nth-child(8)::before',
            ],
            'css' : {
                'background-position' : '70% 50%',
            }
        },
        'AlmanaxWindow' : {
            'selector' : [
                '.window .AlmanaxWindow .col2 .questBlock .questContent .dolmanaxBg',
                '.window .AlmanaxWindow .col2 .saintBlock .saintBg',
            ],
            'css' : {
                'backgroundImage' : 'none',
                'border' : '1px solid #333333',
                'borderRadius' : '25px',
                'backgroundColor' : '#00000057',
                'boxShadow' : 'inset #545454 0px -5px 10px',
            }
        },
    },
    'OneCSSRules' : {
        'SideTabs' : {
            '.WindowSideTabs' : {
                'width' : '48px',
                'borderRadius' : '12px 0 0 12px',
                'backgroundColor' : 'rgba(0,0,0,0.8)',
                'overflow' : 'hidden',
            },
            '.WindowSideTabs .tab' : {
                'backgroundImage' : 'none',
                'width' : '52px',
            },
            '.WindowSideTabs .tab.on' : {
                'backgroundImage' : 'none',
                'background' : 'radial-gradient(circle at center, white 0%, rgba(255, 255, 255, 0.51) 24%, rgba(0, 0, 0, 0.01) 60%)',
            }
        },
        'SpellWindow' : {
            '.window .SpellsWindow .col2 .panel .header .panelTop' : {
                'background' : 'none',
            },
            '.tabs .tab' : {
                'background-color' : '#2d2d2d',
                'border-radius' : '10px 10px 0 0',
                'width' : '11.5%',
            },
            '.tabs .tab.on' : {
                'background-color' : '#8fcc3f',
            },
            '.window .SpellsWindow .col1::before' : {
                'borderImage' : 'none',
                'border' : '2px solid rgba(0, 0, 0, 0.21)',
                'border-radius' : '8px',
            },
            '.TableV2 .tableContent .row' : {
                'background-color' : 'rgba(0,0,0,0.15)',
            },
            '.TableV2 .tableContent .row.odd' : {
                'backgroundColor' : 'rgba(0,0,0,0.35)',
            },
            '.Scroller .scrollerContent' : {
                'margin' : '0',
            },
        },
        'QuestWindow' : {
            '.window .QuestsWindow .objectiveList .objectiveRow:nth-child(2n+1)' : {
                'backgroundColor' : '#0000004d',
            },
            '.window .QuestsWindow .col1 .ListV2 .listItem.odd > .label' : {
                'backgroundColor' : 'rgba(32, 33, 29, 0.7)',
            },
        },
        'BestiaryWindow' : {
            '.window .BestiaryWindow .col1::before' : {
                'borderImage' : 'none',
                'border' : '2px solid black',
                'borderRadius' : '8px',
            },
            '.BestiaryWindow .monster .infos' : {
                'borderImage' : 'none',
                'backgroundColor' : '#2b2b2b9c',
                'border' : '2px solid black',
                'borderRadius' : '8px',
                'boxShadow' : 'inset 0px 0px 20px -2px rgba(140,140,140,0.8)',
            },
            '.window .BestiaryWindow .sublist .label' : {
                'margin' : '0 2px',
            },
            '.window .BestiaryWindow .col1 .SingleSelectionList .listItem.selected > .sublist > .label:nth-child(2n+1)' : {
                'backgroundColor' : 'rgba(30, 31, 28, 0.6)',
            },
            '.window .BestiaryWindow .col1 .SingleSelectionList .listItem:nth-child(2n+1) > .label' : {
                'backgroundColor' : 'rgba(0, 0, 0, 0.46)',
            },
            '.BestiaryWindow .monster .more' : {
                'backgroundColor' : '#2d2c2a9c',
                'boxShadow' : 'inset 0px -2px 20px -2px rgba(140,140,140,0.8)',
            },
            '.BestiaryWindow .monster .stat' : {
                'backgroundColor' : 'rgba(0,0,0,0.20)',
            },
            '.BestiaryWindow .monster .stat:nth-child(2n+1)' : {
                'backgroundColor' : 'rgba(0,0,0,0.4)',
            },
        },
        'AchievementWindow' : {
            '.window .AchievementsWindow .col2 .achievementsScroll .achievementsList .achievement .infos' : {
                'backgroundColor' : 'rgba(62, 63, 57, 0.5)',
            }
        },
        'JobsWindow' : {
            '.RecipeList .recipeTitle' : {
                'backgroundColor' : 'rgba(125, 125, 125, 0.3)',
            },
            '.RecipeList .ingredientsList' : {
                'boxShadow' : 'inset 0px -1px 7px #ffffff42',
            },
        },
        'FriendsWindow' : {
            '.Table .container.content .odd' : {
                'backgroundColor' : 'rgba(0,0,0,0.4)',
            },
        },
        'FellowWindow' : {
            '.Button.secondaryButton' : {
                'backgroundColor' : '#1d1d1d',
            },
        },
        'BidHouseWindow' : {
            '.drillDownList' : {
                'backgroundColor' : 'transparent',
            },
        },
        'BreedingWindow' : {
            '.tileRoom .fg' : {
                'backgroundColor' : 'transparent',
            },
            '.window.BreedingWindow .focusedTile' : {
                'backgroundColor' : 'rgba(125, 125, 125, 0.3)',
            },
        },
    }
};
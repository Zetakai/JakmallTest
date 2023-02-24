import {ActivityIndicator, Button, Modal, RefreshControl, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import MainVM from './main.vm';
import {SafeAreaView} from 'react-native';
import {SectionList} from 'react-native';
import {TouchableOpacity} from 'react-native';

export default function index() {
  const {fetchCategories, fetchCategory, categories, DATA,isLoading} = MainVM();
  const [modalVisible, setModalVisible] = useState([]);
  const [modalText, setModalText] = useState("");
  // const [isRefreshing, setIsRefreshing] = useState(false)
  const [expandedSections, setExpandedSections] = useState(new Set());
  const sectionListRef = useRef();
  useEffect(() => {
    fetchCategories();
  }, []);
  const onRefresh = () => {

    fetchCategories();

}

  const handleToggle = title => {
    setExpandedSections(expandedSections => {
      const next = new Set(expandedSections);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  };
  const gototop = () => {
    sectionListRef.current.scrollToLocation({
      sectionIndex: 0,
      itemIndex: 0,
      viewPosition: 0,
      viewOffset: 70,
      animated: true,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {DATA ? (
        <SectionList
        onRefresh={onRefresh}
        refreshing={isLoading}
        // refreshControl={
        //   <RefreshControl
        //     refreshing={isRefreshing}
        //     onRefresh={onRefresh}
        //   />
        // }
          ref={sectionListRef}
          sections={DATA}
          extraData={expandedSections}
          keyExtractor={(item, index) => item + index}
          ListHeaderComponent={() => (
            <Text style={{color: 'black', width: '100%', textAlign: 'center',fontSize:30}}>
              Zak's Application
            </Text>
          )}
          ListHeaderComponentStyle={{
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',marginVertical:20
          }}
          renderItem={({item, section: {title}}) => {
            // check to see if the section is expanded
            const isExpanded = expandedSections.has(title);

            //return null if it is
            if (!isExpanded) return null;

            return (
              <TouchableOpacity disabled={item.joke=="No Data"} onPress={()=>{setModalText(item.joke);setModalVisible(true)}} style={{borderWidth: 1, width: '90%', alignSelf: 'center',padding:10}}>
                <Text style={styles.title}>{item?.joke}</Text>
              </TouchableOpacity>
            );
          }}
          renderSectionFooter={({section: {title, data}}) => {
            const isExpanded = expandedSections.has(title);
            const length = data.length;
            if (!isExpanded || data[0]?.joke == 'No Data'||length>=6) return null;
            return (
              <TouchableOpacity
                onPress={() =>
                  length<=4&&fetchCategory(DATA, title, length == 2 ? 4 : length == 4 && 6)
                }
                style={{
                  marginBottom: 20,
                  width: '90%',
                  alignSelf: 'center',
                  alignItems: 'center',
                  backgroundColor: 'blue',
                }}>
                <Text>see more</Text>
              </TouchableOpacity>
            );
          }}
          stickySectionHeadersEnabled={true}
          renderSectionHeader={({section}) => (
            <TouchableOpacity
              style={{
                backgroundColor: 'white',
                width: '100%',
                flexDirection: 'row',
                borderWidth: 1,
                padding: 10,
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
              onPress={() => handleToggle(section.title)}>
              <Text style={{fontSize: 10, color: 'black'}}>
                {section.index + 1}
              </Text>
              <Text style={styles.header}>{section.title}</Text>
              <Button title="Go Top" onPress={() => gototop()} />
            </TouchableOpacity>
          )}
        />
      ):<View style={{flex:1,justifyContent:'center',alignItems:'center'}}><ActivityIndicator/></View>}
      <Modal
        animationType='fade'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
         
          setModalVisible(!modalVisible);
        }}>
        <TouchableOpacity onPress={()=>setModalVisible(false)} activeOpacity={1} style={{flex:1,backgroundColor:"rgba(0, 0, 0, 0.5)",justifyContent:'center',alignItems:'center'}}>
          <View style={{width:"50%",backgroundColor:'white',padding:10,borderRadius:10}}>
          <Text style={{color:'black',fontSize:20}}>{modalText}</Text>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  item: {
    backgroundColor: '#f9c2ff',
    marginVertical: 8,
  },
  header: {
    fontSize: 18,
    backgroundColor: '#fff',
    color: 'black',
    width: '40%',
  },
  title: {
    fontSize: 14,
    color: 'black',
  },
  PageHeader: {
    fontSize: 22,
    color: 'black',
  },
});

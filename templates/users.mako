<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" xmlns:tal="http://xml.zope.org/namespaces/tal">
  <form id="users_form" data-dojo-type="dijit.form.Form" name="users_form">
    <table border="0" align="left" valign="top"> 
      <tr>
        <td>
          <table cellspacing="10">
          <tr>
            <td><label for="users_username">Username</label><input type="hidden" name="users_id" id="users_id" /><input type="hidden" name="users_position" id="users_position" />
            <input type="hidden" id="users_operation" name="users_operation" /></td>
            <td> <input type="text" data-dojo-type="dijit.form.TextBox" id="users_username" name="users_name" style="width:30em" /></td>
          </tr>
          <tr>
            <td><label for="users_firstname">First Name</label></td>
            <td> <input type="text" data-dojo-type="dijit.form.TextBox" id="users_firstname" name="users_firstname" style="width:30em" /> </td>
          <tr>
            <td><label for="">Last Name</label></td>
            <td> <input type="text" data-dojo-type="dijit.form.TextBox" id="users_lastname" name="users_lastname" style="width:30em" /> </td>
          </tr>
          <tr>
            <td><label for="">Email</label></td>
            <td>
              <input type="text" name="users_email" id="users_email" size="30"  style="width:30em;"
                dojoType="dijit.form.ValidationTextBox" regExp=".*@.*" trim="true" invalidMessage="Enter email in the format: 'xyz@domain.com'">
            </td>
          </tr>
          <tr>
            <td>Last Login</td>
            <td><span id="users_last_login"></td>
          </tr>
          </table>
        </td>
        <td>
          <table valign="top" align="left" cellspacing="10">  
          <tr>
            <td>
              <label for="">New Password</label> <br /><br />
              <label for="">Confirm Password</label> <br /><br />
            </td>
            <td>
              <div data-dojo-type="dojox.form.PasswordValidator" name="pwValidate">
                <input id="password" name="password" type="password" pwType="new" /><br /><br />
                <input type="password" pwType="verify" /><br /><br />
              </div>
            </td>
          </tr>
          <tr>
            <td><label for="">Active</label></td>
            <td>
              <input id="users_active" name="users_active" data-dojo-type="dijit.form.CheckBox" />
            </td>
          </tr>
          <tr>
            <td><label for="">Super-user</label></td>
            <td>
              <input id="users_superuser" name="users_superuser" data-dojo-type="dijit.form.CheckBox" />
            </td>
          </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td colspan="2" style="padding-left:9em">
          <table border="0" width="100%">
            <tr>
              <td>
                <div style="float:left; margin:5px;" width="150%">
                  <h2>Available Privileges</h2>
                  <select id="users_available_permissions" name="users_available_permissions" size="10" multiple="true">
                    % for permission in permissions:
                        <option value="${permission.id}">${permission.description}</option>
                    % endfor
                  </select>
                </div>
              </td>
              <td>
                  <button data-dojo-type="dijit.form.Button" onClick="users_assigned_privileges()">&nbsp;&gt;&nbsp;
                  </button><br/> 
                  <button data-dojo-type="dijit.form.Button">&gt;&gt;</button><br/>
                  <button data-dojo-type="dijit.form.Button">&nbsp;&lt;&nbsp;</button><br/><button data-dojo-type="dijit.form.Button">&lt;&lt;</button>
              </td>
              <td>
                <div style="float:left; margin:5px; ">
                  <h2>Assigned Privileges</h2>
                  <select data-dojo-type="dijit.form.MultiSelect" id="users_assigned_permissions" name="users_assigned_permissions" size="10" multiple="true">
                  </select>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </form>
</html>
